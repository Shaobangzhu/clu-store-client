import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useApiData from '../src/hooks/useApiData';
import useShoppingCartAction from '../src/hooks/useShoppingCartAction';
import { cartService } from '../src/api/services';
import type { CartDto } from '../src/api/services';
import type { CartItem } from '../src/types/custom';

afterEach(cleanup);
describe('React request lifecycle', () => {
  it('refetches when authentication scope changes without changing the resource key', async () => {
    const { result, rerender } = renderHook(({ scope }) => useApiData('order:1', async () => scope, { scope }), {
      initialProps: { scope: 'first-user' },
    });
    await waitFor(() => expect(result.current.data).toBe('first-user'));
    rerender({ scope: 'second-user' });
    await waitFor(() => expect(result.current.data).toBe('second-user'));
  });
  it('renders unwrapped data and keeps failures observable to callers', async () => {
    const { result } = renderHook(() => useApiData('read', async () => ({ name: 'catalog' })));
    await waitFor(() => expect(result.current.data).toEqual({ name: 'catalog' }));
    await act(async () => {
      await expect(result.current.fetchData(async () => { throw new Error('Rejected'); })).rejects.toThrow('Rejected');
    });
    expect(result.current.error).toBe('Rejected');
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });
  it('aborts on unmount and ignores a late response from a superseded request', async () => {
    let finish: ((value: string) => void) | undefined;
    let originalSignal: AbortSignal | undefined;
    const { result, unmount } = renderHook(() => useApiData('read', signal => {
      originalSignal = signal;
      return new Promise<string>(resolve => { finish = resolve; });
    }));
    await act(async () => { await result.current.fetchData(async () => 'new'); });
    expect(originalSignal?.aborted).toBe(true);
    await act(async () => { finish?.('old'); });
    expect(result.current.data).toBe('new');
    const pending = vi.fn((signal: AbortSignal) => {
      originalSignal = signal;
      return new Promise<string>(() => {});
    });
    act(() => { void result.current.fetchData(pending); });
    unmount();
    expect(originalSignal?.aborted).toBe(true);
  });
});

const item: CartItem = { id: 7, productId: 2, name: 'Product', imageSrc: '/media/a.svg', modelId: 3,
  model: 'Model', modelPrice: 10, memorySizeId: 4, memorySize: 'Memory', memorySizePrice: 2,
  color: 'black', price: 12, qty: 2 };
const emptyCart: CartDto = { id: 1, isDemo: false, currency: 'CNY', items: [], itemCount: 0, totalQty: 0, totalAmount: '0.00' };
describe('authenticated cart reconciliation', () => {
  it('sends only SKU input then synchronizes the server cart', async () => {
    const add = vi.spyOn(cartService, 'add').mockResolvedValue({ data: { id: 7, product: { id: 2, name: 'P', image: '/media/a.svg' },
      model: { id: 3, name: 'M', specification: '', price: '10.00' }, memorySize: { id: 4, name: 'S', price: '2.00' },
      color: 'black', qty: 2, currency: 'CNY', unitPrice: '12.00', lineTotal: '24.00', available: true }, meta: null, status: 201, requestId: null });
    vi.spyOn(cartService, 'get').mockResolvedValue({ data: emptyCart, meta: null, status: 200, requestId: null });
    const dispatch = vi.fn();
    const { result } = renderHook(() => useShoppingCartAction(dispatch, [], 'synthetic-token'));
    await act(async () => { await result.current.addToCart(item); });
    expect(add).toHaveBeenCalledWith({ productId: 2, modelId: 3, memorySizeId: 4, color: 'black', qty: 2 }, { token: 'synthetic-token' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'SYNC_CART', payload: [] });
  });
  it('does not dispatch success after a failed mutation', async () => {
    vi.spyOn(cartService, 'clear').mockRejectedValue(new Error('Denied'));
    const dispatch = vi.fn();
    const { result } = renderHook(() => useShoppingCartAction(dispatch, [], 'synthetic-token'));
    await act(async () => { await result.current.clearCart(); });
    expect(dispatch).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Denied');
  });
});

it('does not reconcile an old cart mutation after its account provider unmounts', async () => {
  let finish!: () => void;
  vi.spyOn(cartService, 'clear').mockImplementation(() => new Promise(resolve => {
    finish = () => resolve({ data: undefined, meta: null, status: 204, requestId: null });
  }));
  const get = vi.spyOn(cartService, 'get');
  const dispatch = vi.fn();
  const { result, unmount } = renderHook(() => useShoppingCartAction(dispatch, [], 'old-account'));
  let pending: Promise<void> | void;
  act(() => { pending = result.current.clearCart(); });
  await waitFor(() => expect(finish).toBeTypeOf('function'));
  unmount();
  await act(async () => { finish(); await pending; });
  expect(get).not.toHaveBeenCalled(); expect(dispatch).not.toHaveBeenCalled();
});

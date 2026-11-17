import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StrictMode, useContext } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import useShoppingCartAction from '../src/hooks/useShoppingCartAction';
import { cartService, type CartDto } from '../src/api/services';
import type { CartInput, CartLine } from '../src/api/cart';
import type { ApiResult } from '../src/helpers/api';
import { ApiError } from '../src/helpers/api';
import ShoppingCartProvider from '../src/contexts/shoppingCart/shoppingCartProvider';
import ShoppingCartContext, { type ShoppingCartContextType } from '../src/contexts/shoppingCart/shoppingCartContext';
import ShoppingCart from '../src/pages/ShoppingCart';
import AddToCartButton from '../src/components/AddToCartButton';
import store from '../src/redux/store';
import { login, logout } from '../src/redux/userSlice';
import english from '../src/assets/languages/en-US.json';

vi.mock('../src/assets/apple.svg?react', () => ({ default: () => <svg /> }));
const i18n = createInstance();
void i18n.init({ lng: 'en-US', resources: { 'en-US': { translation: english } }, initAsync: false });
const line: CartLine = {
  id: 71, product: { id: 2, name: 'Server phone', image: '/media/a.svg' },
  model: { id: 3, name: 'Pro', specification: '', price: '10.00' },
  memorySize: { id: 4, name: '128GB', price: '2.00' }, color: 'black', qty: 2,
  currency: 'CNY', unitPrice: '13.45', lineTotal: '26.90', available: true,
};
const input: CartInput = { productId: 2, modelId: 3, memorySizeId: 4, color: 'black', qty: 1 };
const empty: CartDto = { id: 1, isDemo: false, currency: 'CNY', items: [], itemCount: 0, totalQty: 0, totalAmount: '0.00' };
const cart: CartDto = { ...empty, items: [line], itemCount: 1, totalQty: 2, totalAmount: '26.90' };
const result = <T,>(data: T, status = 200): ApiResult<T> => ({ data, status, meta: null, requestId: null });
const apiFailure = (status = 500, code = 'INTERNAL_ERROR') => new ApiError(status, code, 'private backend detail', null, null, null);
function deferred<T>() {
  let resolve!: (data: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
async function loaded(data = cart) {
  const get = vi.spyOn(cartService, 'get').mockResolvedValue(result(data));
  const hook = renderHook(() => useShoppingCartAction('account-a'));
  await waitFor(() => expect(hook.result.current.ready).toBe(true));
  return { ...hook, get };
}
const credentials = { identifier: 'test', password: 'test' };
function authenticate(token = 'account-a') {
  store.dispatch(login.pending(token, credentials));
  store.dispatch(login.fulfilled({ token, expiresAt: Date.now() + 60000,
    user: { id: token, username: token, email: `${token}@example.test`, role: 'USER' } }, token, credentials));
}
function app(children = <ShoppingCart />) {
  return <I18nextProvider i18n={i18n}><Provider store={store}><ShoppingCartProvider>
    <MemoryRouter>{children}</MemoryRouter>
  </ShoppingCartProvider></Provider></I18nextProvider>;
}
afterEach(() => { cleanup(); store.dispatch(logout()); vi.unstubAllGlobals(); vi.useRealTimers(); localStorage.clear(); });

describe('server cart lifecycle', () => {
  it('loads again after remount/refresh and never imports an old anonymous cart', async () => {
    localStorage.setItem('shoppingCart', JSON.stringify([{ productId: 999 }]));
    const add = vi.spyOn(cartService, 'add');
    const first = await loaded();
    expect(first.result.current.cart).toEqual(cart);
    first.unmount();
    const second = renderHook(() => useShoppingCartAction('account-a'));
    await waitFor(() => expect(second.result.current.cart).toEqual(cart));
    expect(first.get).toHaveBeenCalledTimes(2);
    expect(add).not.toHaveBeenCalled();
  });
  it('requires login for every operation, including loading, without local success', async () => {
    const get = vi.spyOn(cartService, 'get');
    const add = vi.spyOn(cartService, 'add');
    const update = vi.spyOn(cartService, 'update');
    const remove = vi.spyOn(cartService, 'remove');
    const clear = vi.spyOn(cartService, 'clear');
    const { result: hook } = renderHook(() => useShoppingCartAction(null));
    await act(async () => {
      for (const call of [() => hook.current.addToCart(input), () => hook.current.updateItem(71, 3),
        () => hook.current.removeFromCart(71), () => hook.current.clearCart(), () => hook.current.refreshCart()]) {
        expect(await call()).toBe(false);
      }
    });
    for (const mock of [get, add, update, remove, clear]) expect(mock).not.toHaveBeenCalled();
    expect(hook.current.cartItems).toEqual([]);
    expect(hook.current.error).toBe('cart.signIn');
  });
  it.each([
    input, { ...input, modelId: 30 }, { ...input, memorySizeId: 40 },
    { ...input, color: 'blue' }, { ...input, productId: 20 },
  ])('sends full SKU identity and accepts only the server merge/split result: %j', async sku => {
    const { result: hook, get } = await loaded();
    const merges = sku === input;
    const added = { ...line, id: merges ? 71 : 99, qty: merges ? 3 : 1,
      product: { ...line.product, id: sku.productId }, model: { ...line.model, id: sku.modelId },
      memorySize: { ...line.memorySize, id: sku.memorySizeId }, color: sku.color };
    vi.spyOn(cartService, 'add').mockResolvedValue(result(added, merges ? 200 : 201));
    const authoritative = { ...cart, items: merges ? [added] : [line, added],
      itemCount: merges ? 1 : 2, totalQty: 3, totalAmount: '78.91' };
    const pending = deferred<ApiResult<CartDto>>();
    get.mockReturnValueOnce(pending.promise);
    let action!: Promise<boolean>;
    act(() => { action = hook.current.addToCart(sku); });
    await waitFor(() => expect(get).toHaveBeenCalledTimes(2));
    expect(cartService.add).toHaveBeenCalledWith(sku, expect.objectContaining({ token: 'account-a', signal: expect.any(AbortSignal) }));
    expect(hook.current.cart).toEqual(cart);
    await act(async () => { pending.resolve(result(authoritative)); expect(await action).toBe(true); });
    expect(hook.current.cart).toEqual(authoritative);
  });
  it('uses backend IDs and absolute quantities, then refetches after PATCH, DELETE and clear', async () => {
    const { result: hook, get } = await loaded();
    const update = vi.spyOn(cartService, 'update').mockResolvedValue(result({ ...line, qty: 8 }));
    const remove = vi.spyOn(cartService, 'remove').mockResolvedValue(result(undefined, 204));
    const clear = vi.spyOn(cartService, 'clear').mockResolvedValue(result(undefined, 204));
    get.mockResolvedValueOnce(result({ ...cart, items: [{ ...line, qty: 8 }], totalQty: 8, totalAmount: '107.60' }));
    await act(async () => { expect(await hook.current.updateItem(71, 8)).toBe(true); });
    expect(update).toHaveBeenCalledWith(71, { qty: 8 }, expect.anything());
    expect(hook.current.cartItems[0]?.qty).toBe(8);
    get.mockResolvedValueOnce(result(empty));
    await act(async () => { expect(await hook.current.removeFromCart(71)).toBe(true); });
    expect(remove).toHaveBeenCalledWith(71, expect.anything());
    expect(hook.current.cartItems).toEqual([]);
    await act(async () => { expect(await hook.current.clearCart()).toBe(true); });
    expect(clear).toHaveBeenCalledTimes(1); expect(get).toHaveBeenCalledTimes(4);
  });
  it('blocks mutations during initial load, the write and reconciliation, without queuing stale quantities', async () => {
    const initial = deferred<ApiResult<CartDto>>();
    const reconciliation = deferred<ApiResult<CartDto>>();
    const write = deferred<ApiResult<CartLine>>();
    const get = vi.spyOn(cartService, 'get').mockReturnValueOnce(initial.promise).mockReturnValueOnce(reconciliation.promise);
    const update = vi.spyOn(cartService, 'update').mockReturnValue(write.promise);
    const add = vi.spyOn(cartService, 'add');
    const { result: hook } = renderHook(() => useShoppingCartAction('a'));
    await act(async () => { expect(await hook.current.addToCart(input)).toBe(false); });
    expect(add).not.toHaveBeenCalled();
    await act(async () => { initial.resolve(result(cart)); });
    let first!: Promise<boolean>;
    act(() => { first = hook.current.updateItem(71, 3); void hook.current.updateItem(71, 4); });
    expect(update).toHaveBeenCalledTimes(1);
    await act(async () => { write.resolve(result({ ...line, qty: 3 })); });
    expect(get).toHaveBeenCalledTimes(2);
    await act(async () => {
      expect(await hook.current.updateItem(71, 5)).toBe(false);
      expect(await hook.current.removeFromCart(71)).toBe(false);
      expect(await hook.current.refreshCart()).toBe(false);
    });
    expect(update).toHaveBeenCalledTimes(1); expect(hook.current.cart).toEqual(cart);
    await act(async () => { reconciliation.resolve(result({ ...cart, items: [{ ...line, qty: 3 }] })); await first; });
    expect(hook.current.ready).toBe(true); expect(hook.current.cartItems[0]?.qty).toBe(3);
  });
  it.each(['add', 'update', 'remove', 'clear'] as const)('keeps confirmed state and returns failure when %s fails', async method => {
    const { result: hook, get } = await loaded();
    vi.spyOn(cartService, method).mockRejectedValue(apiFailure());
    const call = { add: () => hook.current.addToCart(input), update: () => hook.current.updateItem(71, 3),
      remove: () => hook.current.removeFromCart(71), clear: () => hook.current.clearCart() }[method];
    await act(async () => { expect(await call()).toBe(false); });
    expect(hook.current.cart).toEqual(cart); expect(hook.current.ready).toBe(false);
    expect(hook.current.error).toBe('cart.failed'); expect(get).toHaveBeenCalledTimes(1);
    await act(async () => { expect(await hook.current.refreshCart()).toBe(true); });
    expect(hook.current.error).toBeNull(); expect(hook.current.ready).toBe(true);
  });
  it('distinguishes a saved mutation with failed reconciliation and prevents duplicate retries', async () => {
    const { result: hook, get } = await loaded();
    const add = vi.spyOn(cartService, 'add').mockResolvedValue(result(line));
    get.mockRejectedValueOnce(new TypeError('Network unavailable'));
    await act(async () => { expect(await hook.current.addToCart(input)).toBe(false); });
    expect(hook.current.error).toBe('cart.reconcileFailed'); expect(hook.current.cart).toEqual(cart);
    await act(async () => { expect(await hook.current.addToCart(input)).toBe(false); });
    expect(add).toHaveBeenCalledTimes(1);
    await act(async () => { await hook.current.refreshCart(); });
    expect(hook.current.ready).toBe(true);
  });
  it('blocks immediate retries after failure before React commits the error render', async () => {
    const { result: hook } = await loaded();
    const add = vi.spyOn(cartService, 'add').mockRejectedValue(apiFailure());
    await act(async () => {
      const action = hook.current.addToCart;
      expect(await action(input)).toBe(false);
      expect(await action(input)).toBe(false);
    });
    expect(add).toHaveBeenCalledTimes(1);
  });
  it('exposes a failed initial load without presenting an empty cart as confirmed', async () => {
    vi.spyOn(cartService, 'get').mockRejectedValue(new TypeError('offline'));
    const { result: hook } = renderHook(() => useShoppingCartAction('a'));
    await waitFor(() => expect(hook.current.error).toBe('cart.failed'));
    expect(hook.current.cart).toBeNull(); expect(hook.current.ready).toBe(false);
  });
  it.each([0, -1, 1.5, 100, NaN, Infinity])('rejects invalid quantity %s locally', async qty => {
    const { result: hook } = await loaded();
    const update = vi.spyOn(cartService, 'update');
    await act(async () => { expect(await hook.current.updateItem(71, qty)).toBe(false); });
    expect(update).not.toHaveBeenCalled(); expect(hook.current.error).toBe('cart.limit');
  });
  it.each([
    { ...cart, items: [{ ...line, qty: 99 }], totalQty: 99 },
    { ...cart, totalQty: 500 },
    { ...empty, itemCount: 50 },
  ])('enforces documented line, cart and configuration limits before adding', async snapshot => {
    const { result: hook } = await loaded(snapshot);
    const add = vi.spyOn(cartService, 'add');
    await act(async () => { expect(await hook.current.addToCart(input)).toBe(false); });
    expect(add).not.toHaveBeenCalled(); expect(hook.current.error).toBe('cart.limit');
  });
  it('allows removing unavailable lines but blocks quantity changes', async () => {
    const { result: hook } = await loaded({ ...cart, items: [{ ...line, available: false }] });
    const update = vi.spyOn(cartService, 'update');
    const remove = vi.spyOn(cartService, 'remove').mockResolvedValue(result(undefined, 204));
    await act(async () => { await hook.current.updateItem(71, 3); });
    expect(update).not.toHaveBeenCalled(); expect(hook.current.error).toBe('cart.unavailableError');
    await act(async () => { await hook.current.refreshCart(); });
    await act(async () => { expect(await hook.current.removeFromCart(71)).toBe(true); });
    expect(remove).toHaveBeenCalledWith(71, expect.anything());
  });
  it.each([
    [422, 'CART_LIMIT_EXCEEDED', 'cart.limit'], [422, 'PRODUCT_UNAVAILABLE', 'cart.unavailableError'],
    [422, 'INVALID_CART', 'cart.unavailableError'], [404, 'CART_ITEM_NOT_FOUND', 'cart.missing'],
    [429, 'RATE_LIMITED', 'cart.rateLimited'], [401, 'UNAUTHORIZED', 'cart.signIn'],
    [403, 'FORBIDDEN', 'cart.failed'],
  ] as const)('handles server rejection %s %s without false success', async (status, code, message) => {
    const { result: hook } = await loaded();
    vi.spyOn(cartService, 'update').mockRejectedValue(apiFailure(status, code));
    await act(async () => { expect(await hook.current.updateItem(71, 3)).toBe(false); });
    expect(hook.current.error).toBe(message); expect(hook.current.cart).toEqual(cart);
  });
});

describe('account and request isolation', () => {
  it.each(['resolve', 'reject'] as const)('ignores a late initial-load %s after account switching', async settle => {
    const old = deferred<ApiResult<CartDto>>();
    const get = vi.spyOn(cartService, 'get').mockReturnValueOnce(old.promise).mockResolvedValue(result(empty));
    const { result: hook, rerender } = renderHook(({ token }) => useShoppingCartAction(token), { initialProps: { token: 'a' } });
    const oldSignal = get.mock.calls[0]?.[0].signal;
    rerender({ token: 'b' });
    await waitFor(() => expect(hook.current.cart).toEqual(empty));
    await act(async () => { if (settle === 'resolve') old.resolve(result(cart)); else old.reject(apiFailure()); });
    expect(oldSignal?.aborted).toBe(true); expect(hook.current.cart).toEqual(empty); expect(hook.current.error).toBeNull();
  });
  it('aborts an old write on logout and never starts its reconciliation after unmount', async () => {
    const { result: hook, unmount, get } = await loaded();
    const write = deferred<ApiResult<undefined>>();
    const clear = vi.spyOn(cartService, 'clear').mockReturnValue(write.promise);
    let pending!: Promise<boolean>;
    act(() => { pending = hook.current.clearCart(); });
    unmount();
    await act(async () => { write.resolve(result(undefined, 204)); expect(await pending).toBe(false); });
    expect(clear.mock.calls[0]?.[0].signal?.aborted).toBe(true); expect(get).toHaveBeenCalledTimes(1);
  });
  it('ignores old reconciliation and permits the new account to operate independently', async () => {
    const get = vi.spyOn(cartService, 'get').mockResolvedValue(result(cart));
    const { result: hook, rerender } = renderHook(({ token }) => useShoppingCartAction(token), { initialProps: { token: 'a' } });
    await waitFor(() => expect(hook.current.ready).toBe(true));
    vi.spyOn(cartService, 'clear').mockResolvedValue(result(undefined, 204));
    const old = deferred<ApiResult<CartDto>>();
    get.mockReturnValueOnce(old.promise);
    let pending!: Promise<boolean>;
    act(() => { pending = hook.current.clearCart(); });
    await waitFor(() => expect(get).toHaveBeenCalledTimes(2));
    get.mockResolvedValue(result(empty)); rerender({ token: 'b' });
    await waitFor(() => expect(hook.current.cart).toEqual(empty));
    await act(async () => { old.resolve(result(cart)); expect(await pending).toBe(false); });
    expect(hook.current.cart).toEqual(empty);
    await act(async () => { expect(await hook.current.clearCart()).toBe(true); });
  });
  it('ignores responses from the discarded StrictMode effect even with the same token', async () => {
    const old = deferred<ApiResult<CartDto>>();
    vi.spyOn(cartService, 'get').mockReturnValueOnce(old.promise).mockResolvedValue(result(empty));
    const { result: hook } = renderHook(() => useShoppingCartAction('a'), { wrapper: StrictMode });
    await waitFor(() => expect(hook.current.cart).toEqual(empty));
    await act(async () => { old.resolve(result(cart)); });
    expect(hook.current.cart).toEqual(empty);
  });
  it('clears account-specific provider state immediately on logout and loads only the next account', async () => {
    authenticate(); vi.spyOn(cartService, 'get').mockResolvedValue(result(cart));
    render(app()); await screen.findByText('Server phone');
    act(() => { store.dispatch(logout()); });
    expect(screen.queryByText('Server phone')).toBeNull(); expect(screen.getByRole('link', { name: english.cart.signIn })).toBeTruthy();
    vi.mocked(cartService.get).mockResolvedValue(result(empty));
    act(() => { authenticate('account-b'); });
    await screen.findByText(english.cart.empty); expect(screen.queryByText('Server phone')).toBeNull();
  });
});

describe('cart UI and typed HTTP', () => {
  it('displays exact server prices/totals, every SKU option, and blocks unavailable checkout', async () => {
    authenticate();
    vi.spyOn(cartService, 'get').mockResolvedValue(result({ ...cart, totalAmount: '9007199254740993.01',
      items: [{ ...line, available: false }] }));
    render(app());
    await screen.findByText('Server phone');
    expect(screen.getByText('black | 128GB | Pro')).toBeTruthy();
    expect(screen.getByText('Unit price: RMB 13.45')).toBeTruthy();
    expect(screen.getByText('Line total: RMB 26.90')).toBeTruthy();
    expect(screen.getByText('Total: RMB 9,007,199,254,740,993.01')).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Quantity' })).toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'Checkout' })).toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'Remove item from cart' })).toHaveProperty('disabled', false);
    expect(screen.queryByText(/shipping/i)).toBeNull();
  });
  it('supports quantities above five and disables increment at the limit', async () => {
    authenticate(); vi.spyOn(cartService, 'get').mockResolvedValue(result({ ...cart, totalQty: 99, items: [{ ...line, qty: 99 }] }));
    render(app()); await screen.findByText('Server phone');
    expect(screen.getByRole('combobox', { name: 'Quantity' })).toHaveProperty('value', '99');
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'Decrease quantity' })).toHaveProperty('disabled', false);
  });
  it('shows login instead of an anonymous add action', () => {
    render(app(<AddToCartButton item={input} />));
    expect(screen.getByRole('link', { name: english.cart.signIn })).toHaveProperty('href', 'http://localhost:5178/auth/signin');
    expect(screen.queryByRole('button')).toBeNull();
  });
  it('keeps the displayed quantity after an API failure and exposes a retry path', async () => {
    authenticate(); vi.spyOn(cartService, 'get').mockResolvedValue(result(cart));
    vi.spyOn(cartService, 'update').mockRejectedValue(apiFailure());
    render(app()); await screen.findByText('Server phone');
    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await screen.findByRole('alert');
    expect(screen.getByRole('combobox')).toHaveProperty('value', '2');
    expect(screen.getByRole('button', { name: 'Checkout' })).toHaveProperty('disabled', true);
    expect(screen.getByText(english.cart.lastConfirmed)).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: 'Reload cart' })[0]!);
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });
  it('uses canonical authenticated HTTP methods and SKU-only bodies', async () => {
    const requests: Request[] = [];
    vi.stubGlobal('fetch', vi.fn(async (request: Request) => {
      requests.push(request);
      if (request.method === 'DELETE') return new Response(null, { status: 204 });
      return new Response(JSON.stringify({ success: true, data: request.method === 'GET' ? cart : line, meta: null }));
    }));
    const { result: hook } = renderHook(() => useShoppingCartAction('http-token'));
    await waitFor(() => expect(hook.current.ready).toBe(true));
    await act(async () => { await hook.current.addToCart(input); });
    await act(async () => { await hook.current.updateItem(71, 9); });
    await act(async () => { await hook.current.removeFromCart(71); });
    await act(async () => { await hook.current.clearCart(); });
    expect(requests.map(request => [request.method, new URL(request.url).pathname])).toEqual([
      ['GET', '/api/shopping-cart'], ['POST', '/api/shopping-cart/items'], ['GET', '/api/shopping-cart'],
      ['PATCH', '/api/shopping-cart/items/71'], ['GET', '/api/shopping-cart'],
      ['DELETE', '/api/shopping-cart/items/71'], ['GET', '/api/shopping-cart'],
      ['DELETE', '/api/shopping-cart/items'], ['GET', '/api/shopping-cart'],
    ]);
    expect(await requests[1]!.json()).toEqual(input); expect(await requests[3]!.json()).toEqual({ qty: 9 });
    for (const request of requests) expect(request.headers.get('Authorization')).toBe('Bearer http-token');
  });
  it.each(['401', 'deadline'] as const)('clears the cart on session expiration via %s', async expiry => {
    authenticate();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: true, data: cart, meta: null }))));
    let current!: ShoppingCartContextType;
    function Probe() { current = useContext(ShoppingCartContext); return <ShoppingCart />; }
    render(app(<Probe />)); await screen.findByText('Server phone');
    if (expiry === '401') vi.stubGlobal('fetch', vi.fn(async () => new Response('expired', { status: 401 })));
    else { vi.useFakeTimers(); vi.setSystemTime(Date.now() + 61000); }
    await act(async () => { expect(await current.updateItem(71, 3)).toBe(false); });
    expect(store.getState().user.status).toBe('anonymous');
    expect(screen.queryByText('Server phone')).toBeNull();
    expect(current.cartItems).toEqual([]);
  });
});

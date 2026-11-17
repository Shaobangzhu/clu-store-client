import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useApiData from '../src/hooks/useApiData';

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

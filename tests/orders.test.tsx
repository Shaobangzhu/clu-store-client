import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import UserLayout from '../src/layouts/UserLayout';
import UserCenter from '../src/pages/UserCenter';
import AdminOrders from '../src/pages/AdminOrders';
import OrderDetail from '../src/pages/OrderDetail';
import RequireAuth from '../src/HOCs/RequireAuth';
import store from '../src/redux/store';
import { login, logout } from '../src/redux/userSlice';
import { orderService, type OrderDto } from '../src/api/services';
import english from '../src/assets/languages/en-US.json';

vi.mock('../src/assets/apple.svg?react', () => ({ default: () => <svg /> }));
const i18n = createInstance();
void i18n.init({ lng: 'en', resources: { en: { translation: english } }, initAsync: false });
const order: OrderDto = { id: 901, userId: 'a', status: 'pending', currency: 'CNY', totalAmount: '26.90',
  createdAt: '2026-01-01T01:00:00.000Z', updatedAt: '2026-01-02T02:00:00.000Z',
  items: [{ id: 1, productId: null, productName: 'Snapshot product', modelName: 'Saved model',
    modelSpecification: 'Saved specification', memoryName: '256GB', color: 'Silver', qty: 2,
    unitPrice: '13.45', lineTotal: '26.90' }], statusHistory: [] };
const meta = { pageSize: 20, sort: 'newest', hasMore: false, nextCursor: null };
function json(data: unknown, pagination: unknown = null) {
  return new Response(JSON.stringify({ success: true, data, meta: pagination }), { status: 200,
    headers: { 'Content-Type': 'application/json' } });
}
function failure(status: number) {
  return new Response(JSON.stringify({ success: false, error: { code: 'TEST_ERROR', message: 'private error' } }),
    { status, headers: { 'Content-Type': 'application/json' } });
}
function authenticate(role: 'USER' | 'ADMIN' = 'USER', id = 'a') {
  const args = { identifier: 'synthetic', password: 'synthetic' };
  store.dispatch(login.pending(id, args));
  store.dispatch(login.fulfilled({ token: `${id}-token`, expiresAt: Date.now() + 600_000,
    user: { id, username: id, email: `${id}@example.test`, role } }, id, args));
}
function mount(path = '/user') {
  return render(<I18nextProvider i18n={i18n}><Provider store={store}><MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/user" element={<RequireAuth><UserCenter /></RequireAuth>} />
    <Route path="/admin/orders" element={<RequireAuth><AdminOrders /></RequireAuth>} />
    <Route path="/orders/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />
    <Route path="/auth/signin" element={<p>Sign in required</p>} />
  </Routes></MemoryRouter></Provider></I18nextProvider>);
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(yes => { resolve = yes; });
  return { promise, resolve };
}
beforeEach(() => { authenticate(); vi.stubGlobal('fetch', vi.fn(async () => json([order], meta))); });
afterEach(() => { cleanup(); store.dispatch(logout()); vi.unstubAllGlobals(); });

describe('order lists and access', () => {
  it.each(['USER', 'ADMIN'] as const)('loads own snapshots for %s and follows the actual detail route', async role => {
    authenticate(role);
    const requests: Request[] = [];
    vi.stubGlobal('fetch', vi.fn(async (request: Request) => {
      requests.push(request); return new URL(request.url).pathname === '/api/orders' ? json([order], meta) : json(order);
    }));
    mount();
    await screen.findByText('Snapshot product');
    expect(requests[0]!.headers.get('Authorization')).toBe('Bearer a-token');
    expect(new URL(requests[0]!.url).searchParams.has('userId')).toBe(false);
    expect(screen.getByText(/Total: RMB 26.90/)).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: /View details/ }));
    await screen.findByRole('heading', { name: english.order.title });
    await waitFor(() => expect(requests).toHaveLength(2));
    expect(new URL(requests[1]!.url).pathname).toBe('/api/orders/901');
    expect(Boolean(screen.queryByRole('button', { name: 'Approve' }))).toBe(role === 'ADMIN');
  });
  it('passes opaque cursors unchanged, keeps sort, and restarts without a cursor', async () => {
    const requests: URL[] = [];
    vi.stubGlobal('fetch', vi.fn(async (request: Request) => {
      const url = new URL(request.url); requests.push(url);
      return url.searchParams.has('cursor') ? json([{ ...order, id: 902, items: [] }], meta)
        : json([order], { ...meta, hasMore: true, nextCursor: 'opaque+/=cursor' });
    }));
    mount(); await screen.findByText('Snapshot product');
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await screen.findByRole('link', { name: /902/ });
    expect(requests[1]!.searchParams.get('cursor')).toBe('opaque+/=cursor');
    expect(requests[1]!.searchParams.get('sort')).toBe('newest');
    expect(requests[1]!.searchParams.has('page')).toBe(false);
    expect(screen.queryByText('Snapshot product')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Next page' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'First page' }));
    await screen.findByText('Snapshot product');
    expect(requests[2]!.searchParams.has('cursor')).toBe(false);
  });
  it('shows empty history', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json([], meta))); mount();
    await screen.findByText('No orders on this page.');
  });
  it('blocks direct admin navigation for a verified USER without issuing a request', () => {
    mount('/admin/orders'); expect(screen.getByRole('alert').textContent).toContain('permission');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('loads the ADMIN endpoint while own history still uses /api/orders', async () => {
    authenticate('ADMIN'); mount('/admin/orders'); await screen.findByText('Snapshot product');
    expect(new URL((vi.mocked(fetch).mock.calls[0]![0] as Request).url).pathname).toBe('/api/admin/orders');
  });
  it.each(['/user', '/admin/orders', '/orders/901'])('redirects unauthenticated %s', path => {
    store.dispatch(logout()); mount(path); expect(screen.getByText('Sign in required')).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each([403, 404, 500])('handles detail access error %i without exposing data', async status => {
    vi.stubGlobal('fetch', vi.fn(async () => failure(status))); mount('/orders/901');
    await screen.findByRole('alert'); expect(screen.queryByText('Snapshot product')).toBeNull();
    expect(screen.queryByText('private error')).toBeNull();
  });
  it('discards delayed data across account changes and resets pagination', async () => {
    const pending = deferred<Response>();
    vi.stubGlobal('fetch', vi.fn().mockImplementationOnce(() => pending.promise).mockResolvedValue(json([], meta)));
    mount(); await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    act(() => authenticate('USER', 'b')); await screen.findByText('No orders on this page.');
    await act(async () => pending.resolve(json([order], meta)));
    expect(screen.queryByText('Snapshot product')).toBeNull();
    const second = vi.mocked(fetch).mock.calls[1]![0] as Request;
    expect(second.headers.get('Authorization')).toBe('Bearer b-token');
    expect(new URL(second.url).searchParams.has('cursor')).toBe(false);
  });
  it.each(['/user', '/admin/orders', '/orders/901'])('expires the session on authenticated 401 at %s', async path => {
    authenticate('ADMIN'); vi.stubGlobal('fetch', vi.fn(async () => failure(401))); mount(path);
    await screen.findByText('Sign in required'); expect(store.getState().user.token).toBeNull();
  });
});

describe('admin decisions', () => {
  it.each(['approve', 'reject'] as const)('submits %s with a trimmed note and reconciles history', async decision => {
    authenticate('ADMIN'); let decided = false;
    const requests: Request[] = [];
    vi.stubGlobal('fetch', vi.fn(async (request: Request) => {
      requests.push(request);
      if (request.method === 'POST') { decided = true; return json({ ...order, status: decision === 'approve' ? 'approved' : 'rejected' }); }
      return json(decided ? { ...order, status: decision === 'approve' ? 'approved' : 'rejected', statusHistory: [
        { id: 2, fromStatus: 'pending', toStatus: decision === 'approve' ? 'approved' : 'rejected', operatorId: 'a',
          createdAt: order.updatedAt, metadata: { note: 'Saved decision note' } },
      ] } : order);
    }));
    mount('/orders/901'); await screen.findByText('Snapshot product');
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '  Decision note  ' } });
    fireEvent.click(screen.getByRole('button', { name: decision === 'approve' ? 'Approve' : 'Reject' }));
    await screen.findByText('Saved decision note');
    expect(requests.map(r => r.method)).toEqual(['GET', 'POST', 'GET']);
    expect(new URL(requests[1]!.url).pathname).toBe(`/api/orders/901/${decision}`);
    expect(await requests[1]!.json()).toEqual({ metadata: { note: 'Decision note' } });
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull();
  });
  it('prevents concurrent opposite and repeated actions through reconciliation', async () => {
    authenticate('ADMIN'); const pending = deferred<Response>(); const reload = deferred<Response>();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(json(order)).mockImplementationOnce(() => pending.promise)
      .mockImplementationOnce(() => reload.promise));
    mount('/orders/901'); await screen.findByText('Snapshot product');
    const approve = screen.getByRole('button', { name: 'Approve' });
    const reject = screen.getByRole('button', { name: 'Reject' });
    act(() => { fireEvent.click(approve); fireEvent.click(approve); fireEvent.click(reject); });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    await act(async () => pending.resolve(json({ ...order, status: 'approved' })));
    fireEvent.click(reject);
    expect(fetch).toHaveBeenCalledTimes(3);
    await act(async () => reload.resolve(json({ ...order, status: 'approved' })));
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull();
  });
  it.each([403, 409, 422, 500])('blocks retry after decision error %i until GET reconciliation', async status => {
    authenticate('ADMIN');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(json(order)).mockResolvedValueOnce(failure(status))
      .mockResolvedValueOnce(json({ ...order, status: 'rejected' })));
    mount('/orders/901'); await screen.findByText('Snapshot product');
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    await screen.findByText(/A failed request may already have been applied/);
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }));
    expect(fetch).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole('button', { name: 'Reload current status' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull());
    expect((vi.mocked(fetch).mock.calls[2]![0] as Request).method).toBe('GET');
  });
  it('does not reconcile a late decision into another account', async () => {
    authenticate('ADMIN'); const pending = deferred<Response>();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(json(order)).mockImplementationOnce(() => pending.promise)
      .mockResolvedValueOnce(failure(403)));
    const get = vi.spyOn(orderService, 'get');
    mount('/orders/901'); await screen.findByText('Snapshot product');
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    act(() => authenticate('USER', 'b')); await screen.findByRole('alert');
    await act(async () => pending.resolve(json({ ...order, status: 'approved' })));
    expect(get).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('Snapshot product')).toBeNull();
  });
});

describe('navigation and recovery', () => {
  it.each(['USER', 'ADMIN'] as const)('shows navigation for verified %s role', role => {
    authenticate(role);
    render(<I18nextProvider i18n={i18n}><Provider store={store}><MemoryRouter><UserLayout /></MemoryRouter></Provider></I18nextProvider>);
    expect(screen.getByRole('link', { name: 'Order history' }).getAttribute('href')).toBe('/user');
    expect(Boolean(screen.queryByRole('link', { name: 'Admin order review' }))).toBe(role === 'ADMIN');
    act(() => store.dispatch(login.pending('new-login', { identifier: 'b', password: 'synthetic' })));
    expect(screen.queryByRole('link', { name: 'Admin order review' })).toBeNull();
  });
  it('recovers a failed post-decision GET without repeating POST', async () => {
    authenticate('ADMIN');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(json(order)).mockResolvedValueOnce(json({ ...order, status: 'approved' }))
      .mockResolvedValueOnce(failure(500)).mockResolvedValueOnce(json({ ...order, status: 'approved' })));
    mount('/orders/901'); await screen.findByText('Snapshot product');
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button', { name: 'Refresh order' }));
    await screen.findByText('Snapshot product');
    expect(vi.mocked(fetch).mock.calls.map(call => (call[0] as Request).method)).toEqual(['GET', 'POST', 'GET', 'GET']);
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull();
  });
  it('expires the session during a decision', async () => {
    authenticate('ADMIN');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(json(order)).mockResolvedValueOnce(failure(401)));
    mount('/orders/901'); await screen.findByText('Snapshot product');
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }));
    await screen.findByText('Sign in required');
    expect(screen.queryByText('Snapshot product')).toBeNull();
  });
  it('retries the same failed cursor page without falling back to the first page', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(json([order], { ...meta, hasMore: true, nextCursor: 'next' }))
      .mockResolvedValueOnce(failure(500)).mockResolvedValueOnce(json([], meta)));
    mount(); await screen.findByText('Snapshot product');
    fireEvent.click(screen.getByRole('button', { name: 'Next page' })); await screen.findByRole('alert');
    expect(screen.queryByText('No orders on this page.')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Refresh order' })); await screen.findByText('No orders on this page.');
    expect(new URL((vi.mocked(fetch).mock.calls[2]![0] as Request).url).searchParams.get('cursor')).toBe('next');
  });
  it('shows server forbidden for an admin whose role was revoked', async () => {
    authenticate('ADMIN'); vi.stubGlobal('fetch', vi.fn(async () => failure(403))); mount('/admin/orders');
    expect((await screen.findByRole('alert')).textContent).toContain('permission');
    expect(store.getState().user.token).toBe('a-token');
  });
});

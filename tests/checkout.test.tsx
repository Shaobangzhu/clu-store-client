import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, Link, MemoryRouter, Route, RouterProvider, Routes, useLocation } from 'react-router-dom';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import CheckOut from '../src/pages/CheckOut';
import OrderDetail from '../src/pages/OrderDetail';
import RequireAuth from '../src/HOCs/RequireAuth';
import ShoppingCartProvider from '../src/contexts/shoppingCart/shoppingCartProvider';
import ShoppingCartContext, { defaultShoppingCartContext, type ShoppingCartContextType } from '../src/contexts/shoppingCart/shoppingCartContext';
import { catalogService, orderService, type CartDto, type OrderDto } from '../src/api/services';
import { ApiError, type ApiResult } from '../src/helpers/api';
import { CHECKOUT_TIMEOUT_MS, intentStorageKey, readIntent, saveIntent } from '../src/checkout/intent';
import store from '../src/redux/store';
import { login, logout } from '../src/redux/userSlice';
import english from '../src/assets/languages/en-US.json';

vi.mock('../src/assets/apple.svg?react', () => ({ default: () => <svg /> }));
const i18n = createInstance();
void i18n.init({ lng: 'en-US', resources: { 'en-US': { translation: english } }, initAsync: false });
const empty: CartDto = { id: 1, isDemo: false, currency: 'CNY', items: [], itemCount: 0, totalQty: 0, totalAmount: '0.00' };
const cart: CartDto = { ...empty, itemCount: 1, totalQty: 2, totalAmount: '9007199254740993.01', items: [{
  id: 71, product: { id: 2, name: 'Server device', image: '/media/a.svg' },
  model: { id: 3, name: 'Pro', specification: 'Server specification', price: '10.00' },
  memorySize: { id: 4, name: '256GB', price: '2.00' }, color: 'Silver', qty: 2,
  currency: 'CNY', unitPrice: '13.45', lineTotal: '26.90', available: true,
}] };
const order: OrderDto = { id: 901, userId: 'account-a', status: 'approved', currency: 'CNY', totalAmount: '26.90',
  createdAt: '2026-01-01T01:00:00.000Z', updatedAt: '2026-01-02T02:00:00.000Z', items: [{
    id: 501, productId: 2, productName: 'Purchased snapshot', modelName: 'Pro snapshot', modelSpecification: 'Saved specification',
    memoryName: '256GB', color: 'Silver', qty: 2, unitPrice: '13.45', lineTotal: '26.90',
  }], statusHistory: [
    { id: 1, fromStatus: null, toStatus: 'pending', operatorId: 'account-a', createdAt: '2026-01-01T01:00:00.000Z', metadata: null },
    { id: 2, fromStatus: 'pending', toStatus: 'approved', operatorId: 'operator', createdAt: '2026-01-02T02:00:00.000Z', metadata: { note: 'Reviewed by operator' } },
  ] };
const receipt = { id: order.id, status: 'pending' as const, currency: 'CNY' as const,
  totalAmount: order.totalAmount, createdAt: order.createdAt, items: order.items.map(item => ({ ...item, productId: 2 })) };
const result = <T,>(data: T, status = 200): ApiResult<T> => ({ data, status, meta: null, requestId: 'synthetic-request' });
const failure = (status: number, code: string) => new ApiError(status, code, 'private server detail', null, null, null);
const json = (data: unknown, status = 200) => new Response(JSON.stringify({ success: true, data, meta: null }), {
  status, headers: { 'Content-Type': 'application/json' },
});
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const credentials = { identifier: 'synthetic', password: 'synthetic' };
function authenticate(account = 'account-a') {
  store.dispatch(login.pending(account, credentials));
  store.dispatch(login.fulfilled({ token: `${account}-token`, expiresAt: Date.now() + 600_000,
    user: { id: account, username: account, email: `${account}@example.test`, role: 'USER' } }, account, credentials));
}
function context(overrides: Partial<ShoppingCartContextType> = {}): ShoppingCartContextType {
  return { ...defaultShoppingCartContext, authenticated: true, ready: true, cart, cartItems: cart.items,
    refreshCart: vi.fn(async () => true), clearCart: vi.fn(async () => true), ...overrides };
}
function Location() { return <output aria-label="Route">{useLocation().pathname}</output>; }
function Harness({ value, children, path = '/checkout' }: {
  value?: ShoppingCartContextType; children?: ReactNode; path?: string;
}) {
  const routes = <MemoryRouter initialEntries={[path]}><Location /><Routes>
    <Route path="/checkout" element={<RequireAuth><CheckOut /></RequireAuth>} />
    <Route path="/orders/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />
    <Route path="/cart" element={<Link to="/checkout">Return to review</Link>} />
    <Route path="/auth/signin" element={<p>Sign in required</p>} />
  </Routes>{children}</MemoryRouter>;
  return <I18nextProvider i18n={i18n}><Provider store={store}>
    {value ? <ShoppingCartContext.Provider value={value}>{routes}</ShoppingCartContext.Provider>
      : <ShoppingCartProvider>{routes}</ShoppingCartProvider>}
  </Provider></I18nextProvider>;
}
function clickPlace() { fireEvent.click(screen.getByRole('button', { name: 'Place demo order' })); }
function clickRetry() { fireEvent.click(screen.getByRole('button', { name: 'Retry same order' })); }
function savedIntent(state: 'unresolved' | 'review' | 'conflict' = 'unresolved', userId = 'account-a') {
  saveIntent({ version: 1, userId, key: 'saved-purchase-key', state });
}
beforeEach(() => {
  sessionStorage.clear();
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('Unexpected HTTP request in isolated test'); }));
  authenticate();
});
afterEach(() => {
  cleanup(); store.dispatch(logout()); sessionStorage.clear(); localStorage.clear();
  vi.unstubAllGlobals(); vi.useRealTimers();
});

describe('demo checkout transport and transaction flow', () => {
  it('uses the application route configuration for checkout and the canonical receipt', async () => {
    const { default: appRouter } = await import('../src/routes');
    const router = createMemoryRouter(appRouter.routes, { initialEntries: ['/checkout'] });
    vi.spyOn(catalogService, 'categories').mockResolvedValue(result([]));
    vi.spyOn(orderService, 'place').mockResolvedValue(result(receipt, 201));
    vi.spyOn(orderService, 'get').mockResolvedValue(result(order));
    render(<I18nextProvider i18n={i18n}><Provider store={store}>
      <ShoppingCartContext.Provider value={context()}><RouterProvider router={router} /></ShoppingCartContext.Provider>
    </Provider></I18nextProvider>);
    clickPlace();
    await screen.findByText('Purchased snapshot');
    expect(router.state.location.pathname).toBe('/orders/901');
    act(() => { store.dispatch(logout()); });
    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/signin'));
    expect(screen.queryByText('Purchased snapshot')).toBeNull();
    router.dispose(); appRouter.dispose();
  });
  it.each([201, 200])('handles HTTP %i, refetches the consumed cart, and routes to current order details', async status => {
    const requests: Request[] = [];
    let placed = false;
    vi.stubGlobal('fetch', vi.fn(async (request: Request) => {
      requests.push(request);
      const path = new URL(request.url).pathname;
      if (path === '/api/shopping-cart' && request.method === 'GET') return json(placed ? empty : cart);
      if (path === '/api/orders/place') {
        expect(request.method).toBe('POST');
        expect(await request.json()).toEqual({});
        expect(request.headers.get('Authorization')).toBe('Bearer account-a-token');
        expect(request.headers.get('Idempotency-Key')).toBe(readIntent('account-a')?.key);
        placed = true;
        return json(receipt, status);
      }
      if (path === '/api/orders/901') return json(order);
      throw new Error(`Unexpected request: ${path}`);
    }));
    if (status === 200) savedIntent();
    render(<Harness />);
    const button = await screen.findByRole('button', { name: status === 201 ? 'Place demo order' : 'Retry same order' });
    await waitFor(() => expect((button as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(button);
    expect(await screen.findByText('Purchased snapshot')).toBeTruthy();
    expect(screen.getByLabelText('Route').textContent).toBe('/orders/901');
    expect(screen.getByText('Approved')).toBeTruthy();
    expect(screen.getByText('Reviewed by operator')).toBeTruthy();
    expect(requests.map(r => `${r.method} ${new URL(r.url).pathname}`)).toEqual([
      'GET /api/shopping-cart', 'POST /api/orders/place', 'GET /api/shopping-cart', 'GET /api/orders/901',
    ]);
    expect(readIntent('account-a')).toMatchObject({ state: 'confirmed', orderId: 901 });
  });

  it('renders exact authoritative totals and SKU fields without payment or shipping inputs', () => {
    render(<Harness value={context()} />);
    expect(screen.getByRole('heading', { name: 'Demo Order Review' })).toBeTruthy();
    for (const text of ['Server device', 'Pro · 256GB · Silver', 'Server specification', 'Quantity: 2',
      'Unit price: RMB 13.45', 'Line total: RMB 26.90', 'Total: RMB 9,007,199,254,740,993.01 (CNY)']) {
      expect(screen.getByText(text)).toBeTruthy();
    }
    expect(screen.getByText(english.checkout.demo)).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('locks rapid repeated clicks through delayed placement and reconciliation', async () => {
    const place = deferred<Awaited<ReturnType<typeof orderService.place>>>();
    const refresh = deferred<boolean>();
    const placeMock = vi.spyOn(orderService, 'place').mockReturnValue(place.promise);
    const value = context({ refreshCart: vi.fn(() => refresh.promise) });
    vi.spyOn(orderService, 'get').mockResolvedValue(result(order));
    render(<Harness value={value} />);
    const button = screen.getByRole('button', { name: 'Place demo order' });
    act(() => { button.click(); button.click(); button.click(); });
    expect(placeMock).toHaveBeenCalledTimes(1);
    await act(async () => { place.resolve(result(receipt, 201)); });
    expect(value.refreshCart).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Route').textContent).toBe('/checkout');
    expect(screen.queryByRole('button', { name: 'Retry same order' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Review a new demo order' }));
    expect(placeMock).toHaveBeenCalledTimes(1);
    await act(async () => { refresh.resolve(true); });
    expect(await screen.findByText('Purchased snapshot')).toBeTruthy();
    expect(value.clearCart).not.toHaveBeenCalled();
  });

  it('treats a failed post-success cart GET as confirmed and offers GET-only recovery', async () => {
    let cartReads = 0;
    const requests: Request[] = [];
    vi.stubGlobal('fetch', vi.fn(async (request: Request) => {
      requests.push(request);
      const path = new URL(request.url).pathname;
      if (path === '/api/shopping-cart') {
        cartReads += 1;
        if (cartReads === 2) throw new TypeError('Lost cart GET');
        return json(cartReads === 1 ? cart : empty);
      }
      if (path === '/api/orders/place') return json(receipt, 201);
      if (path === '/api/orders/901') return json(order);
      throw new Error('Unexpected route');
    }));
    render(<Harness />);
    await waitFor(() => expect((screen.getByRole('button', { name: 'Place demo order' }) as HTMLButtonElement).disabled).toBe(false));
    clickPlace();
    expect(await screen.findByText(english.checkout.cartRefreshFailed)).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: 'Reload cart' }).at(-1)!);
    await waitFor(() => expect(screen.queryByText(english.checkout.cartRefreshFailed)).toBeNull());
    expect(requests.filter(r => r.method === 'POST')).toHaveLength(1);
    expect(requests.some(r => r.method === 'DELETE')).toBe(false);
  });
});

describe('uncertain submissions and durable intent recovery', () => {
  it.each([new TypeError('Connection lost'), failure(502, 'HTTP_ERROR'), failure(200, 'INVALID_RESPONSE'), failure(503, 'CHECKOUT_BUSY'), failure(429, 'RATE_LIMITED')])(
    'retains the same key after %s and retries only on user action', async error => {
      const place = vi.spyOn(orderService, 'place').mockRejectedValueOnce(error).mockResolvedValueOnce(result(receipt));
      vi.spyOn(orderService, 'get').mockResolvedValue(result(order));
      render(<Harness value={context()} />);
      clickPlace();
      await screen.findByRole('alert');
      const key = readIntent('account-a')?.key;
      expect(key).toBeTruthy();
      expect(place).toHaveBeenCalledTimes(1);
      clickRetry();
      await screen.findByText('Purchased snapshot');
      expect(place.mock.calls.map(call => call[1])).toEqual([key, key]);
    });

  it('times out explicitly, ignores a late success, then retries with the saved key', async () => {
    vi.useFakeTimers();
    const pending = deferred<Awaited<ReturnType<typeof orderService.place>>>();
    const place = vi.spyOn(orderService, 'place').mockReturnValueOnce(pending.promise).mockResolvedValueOnce(result(receipt));
    vi.spyOn(orderService, 'get').mockResolvedValue(result(order));
    render(<Harness value={context()} />);
    clickPlace();
    const key = readIntent('account-a')?.key;
    await act(async () => { await vi.advanceTimersByTimeAsync(CHECKOUT_TIMEOUT_MS); });
    expect(screen.getByRole('alert').textContent).toBe(english.checkout.uncertain);
    expect(place.mock.calls[0]?.[2].signal?.aborted).toBe(true);
    await act(async () => { pending.resolve(result(receipt, 201)); });
    expect(screen.getByLabelText('Route').textContent).toBe('/checkout');
    expect(readIntent('account-a')).toMatchObject({ key, state: 'unresolved' });
    await act(async () => { clickRetry(); });
    expect(screen.getByLabelText('Route').textContent).toBe('/orders/901');
    expect(place.mock.calls.map(call => call[1])).toEqual([key, key]);
  });

  it.each(['empty', 'invalid', 'failed-load'])('recovers after reload with a %s cart, without automatic POST', async scenario => {
    const pending = deferred<Awaited<ReturnType<typeof orderService.place>>>();
    const place = vi.spyOn(orderService, 'place').mockReturnValueOnce(pending.promise).mockResolvedValueOnce(result(receipt));
    vi.spyOn(orderService, 'get').mockResolvedValue(result(order));
    const first = render(<Harness value={context()} />);
    clickPlace();
    const key = readIntent('account-a')?.key;
    first.unmount();
    expect(place.mock.calls[0]?.[2].signal?.aborted).toBe(true);
    const currentCart = scenario === 'invalid' ? { ...cart, items: [{ ...cart.items[0]!, available: false }] } : empty;
    render(<Harness value={context({ cart: currentCart, cartItems: currentCart.items, ready: scenario !== 'failed-load' })} />);
    expect(screen.getByText(english.checkout.recovery)).toBeTruthy();
    expect(place).toHaveBeenCalledTimes(1);
    clickRetry();
    await screen.findByText('Purchased snapshot');
    await act(async () => { pending.resolve(result(receipt, 201)); });
    expect(place.mock.calls.map(call => call[1])).toEqual([key, key]);
    expect(readIntent('account-a')).toMatchObject({ state: 'confirmed', orderId: 901 });
  });

  it('migrates an existing same-session legacy key without regenerating it', async () => {
    sessionStorage.setItem('clu.checkout.intent', 'legacy-key');
    const place = vi.spyOn(orderService, 'place').mockRejectedValue(new TypeError('Lost response'));
    render(<Harness value={context()} />);
    clickRetry();
    await screen.findByRole('alert');
    expect(place.mock.calls[0]?.[1]).toBe('legacy-key');
    expect(readIntent('account-a')?.key).toBe('legacy-key');
    expect(sessionStorage.getItem('clu.checkout.intent')).toBeNull();
  });

  it('requires an explicit new purchase after confirmation and then generates a new key', async () => {
    savedIntent();
    const place = vi.spyOn(orderService, 'place').mockResolvedValue(result(receipt));
    vi.spyOn(orderService, 'get').mockResolvedValue(result(order));
    const first = render(<Harness value={context()} />);
    clickRetry();
    await screen.findByText('Purchased snapshot');
    first.unmount();
    render(<Harness value={context()} />);
    expect(screen.queryByRole('button', { name: 'Place demo order' })).toBeNull();
    expect(screen.getByRole('link', { name: 'View confirmed order' }).getAttribute('href')).toBe('/orders/901');
    expect(place).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Review a new demo order' }));
    clickPlace();
    await screen.findByText('Purchased snapshot');
    expect(place.mock.calls[1]?.[1]).not.toBe('saved-purchase-key');
  });

  it('keeps the original durable key if persisting confirmation fails', async () => {
    savedIntent();
    const original = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      if (key === intentStorageKey('account-a') && value.includes('confirmed')) throw new Error('Storage full');
      original.call(this, key, value);
    });
    vi.spyOn(orderService, 'place').mockResolvedValue(result(receipt, 201));
    vi.spyOn(orderService, 'get').mockResolvedValue(result(order));
    render(<Harness value={context()} />);
    clickRetry();
    await screen.findByText('Purchased snapshot');
    expect(readIntent('account-a')).toMatchObject({ key: 'saved-purchase-key', state: 'unresolved' });
  });

  it('persists confirmation before reconciliation so reload cannot submit it again', async () => {
    const refresh = deferred<boolean>();
    const place = vi.spyOn(orderService, 'place').mockResolvedValue(result(receipt, 201));
    const first = render(<Harness value={context({ refreshCart: () => refresh.promise })} />);
    clickPlace();
    await screen.findByText('Demo order #901 is confirmed.');
    first.unmount();
    render(<Harness value={context({ cart: empty, cartItems: [] })} />);
    expect(screen.getByText('Demo order #901 is confirmed.')).toBeTruthy();
    expect(place).toHaveBeenCalledTimes(1);
    expect((screen.getByRole('button', { name: 'Review a new demo order' }) as HTMLButtonElement).disabled).toBe(true);
    await act(async () => { refresh.resolve(true); });
    expect(screen.getByLabelText('Route').textContent).toBe('/checkout');
  });
});

describe('checkout validation and isolation', () => {
  it.each([
    { cart: empty, cartItems: [] }, { ready: false }, { busy: true },
    { cart: { ...cart, items: [{ ...cart.items[0]!, available: false }] } },
    { cart: { ...cart, items: [{ ...cart.items[0]!, qty: 0 }] } },
    { cart: { ...cart, items: [{ ...cart.items[0]!, model: { ...cart.items[0]!.model, id: 0 } }] } },
    { cart: { ...cart, totalQty: 501 } },
  ])('blocks a new submission with an invalid or unready cart: %j', overrides => {
    const place = vi.spyOn(orderService, 'place');
    render(<Harness value={context(overrides)} />);
    clickPlace();
    expect(place).not.toHaveBeenCalled();
    expect(readIntent('account-a')).toBeNull();
  });

  it.each(['EMPTY_CART', 'INVALID_CART', 'INVALID_PRODUCT_CONFIGURATION', 'PRODUCT_UNAVAILABLE', 'ORDER_AMOUNT_EXCEEDED'])(
    'requires fresh cart review after 422 %s, retaining the key', async code => {
      const place = vi.spyOn(orderService, 'place').mockRejectedValueOnce(failure(422, code)).mockResolvedValueOnce(result(receipt));
      vi.spyOn(orderService, 'get').mockResolvedValue(result(order));
      const value = context();
      render(<Harness value={value} />);
      clickPlace();
      await screen.findByRole('alert');
      const key = readIntent('account-a')?.key;
      clickRetry();
      expect(place).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByRole('button', { name: 'Reload cart' }));
      await waitFor(() => expect((screen.getByRole('button', { name: 'Retry same order' }) as HTMLButtonElement).disabled).toBe(false));
      clickRetry();
      await screen.findByText('Purchased snapshot');
      expect(place.mock.calls.map(call => call[1])).toEqual([key, key]);
    });

  it('blocks conflicts persistently without minting another key', async () => {
    const place = vi.spyOn(orderService, 'place').mockRejectedValue(failure(409, 'IDEMPOTENCY_CONFLICT'));
    const first = render(<Harness value={context()} />);
    clickPlace();
    expect((await screen.findByRole('alert')).textContent).toBe(english.checkout.conflict);
    const key = readIntent('account-a')?.key;
    first.unmount();
    render(<Harness value={context()} />);
    clickRetry();
    expect(place).toHaveBeenCalledTimes(1);
    expect(readIntent('account-a')).toMatchObject({ key, state: 'conflict' });
  });

  it.each(['corrupt', 'read-disabled', 'write-disabled', 'silent-write-failure'])('fails closed if intent storage is %s', mode => {
    const place = vi.spyOn(orderService, 'place');
    if (mode === 'corrupt') sessionStorage.setItem(intentStorageKey('account-a'), '{bad');
    if (mode === 'read-disabled') vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('disabled'); });
    if (mode === 'write-disabled') vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('disabled'); });
    if (mode === 'silent-write-failure') vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    render(<Harness value={context()} />);
    clickPlace();
    expect(screen.getByRole('alert').textContent).toBe(english.checkout.storage);
    expect(place).not.toHaveBeenCalled();
  });

  it('requires authentication before showing protected checkout data', () => {
    store.dispatch(logout());
    render(<Harness value={context()} />);
    expect(screen.getByText('Sign in required')).toBeTruthy();
    expect(screen.queryByText('Server device')).toBeNull();
  });

  it('preserves the account-scoped intent across an HTTP 401 and same-account sign-in', async () => {
    const keys: (string | null)[] = [];
    vi.stubGlobal('fetch', vi.fn(async (request: Request) => {
      keys.push(request.headers.get('Idempotency-Key'));
      return new Response(JSON.stringify({ success: false, error: { code: 'TOKEN_EXPIRED', message: 'Expired' } }), {
        status: 401, headers: { 'Content-Type': 'application/json' },
      });
    }));
    const first = render(<Harness value={context()} />);
    clickPlace();
    await screen.findByText('Sign in required');
    const key = readIntent('account-a')?.key;
    expect(key).toBeTruthy();
    first.unmount();
    authenticate();
    const place = vi.spyOn(orderService, 'place').mockResolvedValue(result(receipt));
    vi.spyOn(orderService, 'get').mockResolvedValue(result(order));
    render(<Harness value={context()} />);
    clickRetry();
    await screen.findByText('Purchased snapshot');
    expect(place.mock.calls[0]?.[1]).toBe(key);
    expect(keys).toEqual([key]);
  });

  it('retains a pending intent when the demo session expires while waiting for a response', async () => {
    vi.useFakeTimers();
    authenticate(); // Install the session deadline on the controlled clock.
    const pending = deferred<Awaited<ReturnType<typeof orderService.place>>>();
    vi.spyOn(orderService, 'place').mockReturnValue(pending.promise);
    render(<Harness value={context()} />);
    clickPlace();
    const key = readIntent('account-a')?.key;
    await act(async () => { await vi.advanceTimersByTimeAsync(600_001); });
    expect(screen.getByText('Sign in required')).toBeTruthy();
    await act(async () => { pending.resolve(result(receipt, 201)); });
    expect(readIntent('account-a')).toMatchObject({ key, state: 'unresolved' });
  });

  it('ignores late account-A responses and keeps account-B intent isolated', async () => {
    const pending = deferred<Awaited<ReturnType<typeof orderService.place>>>();
    const place = vi.spyOn(orderService, 'place').mockReturnValueOnce(pending.promise).mockRejectedValueOnce(new TypeError('Offline'));
    render(<Harness value={context()} />);
    clickPlace();
    const firstKey = readIntent('account-a')?.key;
    act(() => { authenticate('account-b'); });
    expect(place.mock.calls[0]?.[2].signal?.aborted).toBe(true);
    clickPlace();
    await screen.findByRole('alert');
    const secondKey = readIntent('account-b')?.key;
    await act(async () => { pending.resolve(result(receipt, 201)); });
    expect(screen.getByLabelText('Route').textContent).toBe('/checkout');
    expect(readIntent('account-a')).toMatchObject({ key: firstKey, state: 'unresolved' });
    expect(readIntent('account-b')).toMatchObject({ key: secondKey, state: 'unresolved' });
    expect(secondKey).not.toBe(firstKey);
  });

  it('does not submit automatically under StrictMode', async () => {
    savedIntent();
    const place = vi.spyOn(orderService, 'place').mockRejectedValue(new TypeError('Offline'));
    render(<StrictMode><Harness value={context()} /></StrictMode>);
    expect(place).not.toHaveBeenCalled();
    clickRetry();
    await screen.findByRole('alert');
    expect(place).toHaveBeenCalledTimes(1);
  });

  it.each([202, 204])('does not confirm unsupported success status %i', async status => {
    vi.spyOn(orderService, 'place').mockResolvedValue(result(receipt, status));
    render(<Harness value={context()} />);
    clickPlace();
    expect((await screen.findByRole('alert')).textContent).toBe(english.checkout.uncertain);
    expect(readIntent('account-a')?.state).toBe('unresolved');
  });

  it('keeps the key when a success envelope contains an invalid receipt ID', async () => {
    vi.spyOn(orderService, 'place').mockResolvedValue(result({ ...receipt, id: 0 }, 201));
    render(<Harness value={context()} />);
    clickPlace();
    expect((await screen.findByRole('alert')).textContent).toBe(english.checkout.uncertain);
    expect(readIntent('account-a')?.state).toBe('unresolved');
  });
});

describe('canonical order detail', () => {
  it.each(['pending', 'approved', 'rejected'] as const)('displays backend %s status, snapshots, totals and history', async status => {
    const get = vi.spyOn(orderService, 'get').mockResolvedValue(result({ ...order, status }));
    render(<Harness value={context()} path="/orders/901" />);
    await screen.findByText('Purchased snapshot');
    expect(screen.getByText(english.order[status])).toBeTruthy();
    expect(screen.getByText('Saved specification')).toBeTruthy();
    expect(screen.getByText('RMB 26.90 (CNY)')).toBeTruthy();
    expect(screen.getByText('Created → Pending review')).toBeTruthy();
    expect(screen.getByText('Pending review → Approved')).toBeTruthy();
    expect(screen.getByText('Reviewed by operator')).toBeTruthy();
    expect(get).toHaveBeenCalledWith(901, expect.objectContaining({ token: 'account-a-token' }));
  });

  it.each(['bad', '0', '-1', '1.5', '2147483648', '1e2'])('rejects invalid route ID %s without an API call', id => {
    const get = vi.spyOn(orderService, 'get');
    render(<Harness value={context()} path={`/orders/${id}`} />);
    expect(screen.getByRole('alert').textContent).toBe(english.order.notFound);
    expect(get).not.toHaveBeenCalled();
  });

  it.each([404, 500])('shows a safe %i error and retries GET only', async status => {
    const get = vi.spyOn(orderService, 'get').mockRejectedValueOnce(failure(status, 'ORDER_NOT_FOUND')).mockResolvedValueOnce(result(order));
    const place = vi.spyOn(orderService, 'place');
    render(<Harness value={context()} path="/orders/901" />);
    expect((await screen.findByRole('alert')).textContent).toBe(status === 404 ? english.order.notFound : english.order.failed);
    fireEvent.click(screen.getByRole('button', { name: 'Refresh order' }));
    await screen.findByText('Purchased snapshot');
    expect(get).toHaveBeenCalledTimes(2); expect(place).not.toHaveBeenCalled();
  });

  it('loads the next canonical order and ignores a late previous-route result', async () => {
    const pending = deferred<ApiResult<OrderDto>>();
    const get = vi.spyOn(orderService, 'get').mockReturnValueOnce(pending.promise).mockResolvedValueOnce(result({
      ...order, id: 902, items: [{ ...order.items[0]!, productName: 'Next order snapshot' }],
    }));
    render(<Harness value={context()} path="/orders/901"><Link to="/orders/902">Next order</Link></Harness>);
    fireEvent.click(screen.getByRole('link', { name: 'Next order' }));
    await screen.findByText('Next order snapshot');
    await act(async () => { pending.resolve(result(order)); });
    expect(screen.queryByText('Purchased snapshot')).toBeNull();
    expect(get.mock.calls[0]?.[1].signal?.aborted).toBe(true);
    expect(screen.getByLabelText('Route').textContent).toBe('/orders/902');
  });
});

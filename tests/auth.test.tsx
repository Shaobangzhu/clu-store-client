import '../src/i18n/config';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import reducer, { login, logout, restoreSession } from '../src/redux/userSlice';
import store from '../src/redux/store';
import { clearSession, DEMO_TTL, readSession, SESSION_KEY, saveSession } from '../src/auth/session';
import { cartService } from '../src/api/services';
import RequireAuth from '../src/HOCs/RequireAuth';
import SignIn, { safeReturnPath } from '../src/pages/SignIn';
import Register from '../src/pages/Register';

const user = { id: 'account-a', username: 'Verified name', email: 'a@example.test', role: 'USER', createdAt: '2026-01-01' };
const token = (seconds = 3600) => `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + seconds, name: 'Forged name', role: 'ADMIN' }))}.signature`;
const envelope = (data: unknown, status = 200) => new Response(JSON.stringify({ success: true, data, meta: null }), { status, headers: { 'Content-Type': 'application/json' } });
const failure = (status: number) => new Response(JSON.stringify({ success: false, error: { code: 'ERROR', message: 'private backend detail' } }), { status });
const credentials = { identifier: 'a@example.test', password: 'synthetic-password' };
const makeStore = () => configureStore({ reducer: { user: reducer } });
function mockLogin(jwt = token(), me: unknown = user) {
  return vi.stubGlobal('fetch', vi.fn(async (request: Request) => request.url.endsWith('/login')
    ? envelope({ token: jwt, tokenType: 'Bearer', expiresIn: 3600, expiresAt: new Date(Date.now() + 3600000).toISOString(), user: { ...user, username: 'Ignored login name' } })
    : envelope(me)));
}
beforeEach(() => { clearSession(); });
afterEach(() => { cleanup(); store.dispatch(logout()); clearSession(); vi.useRealTimers(); vi.unstubAllGlobals(); });
describe('authentication lifecycle', () => {
  it('uses identifier, validates /me and stores only allowlisted server identity', async () => {
    mockLogin(token(), { ...user, passwordHash: 'never-store' });
    const s = makeStore();
    await s.dispatch(login(credentials));
    expect(s.getState().user.user).toEqual({ id: user.id, username: user.username, email: user.email, role: user.role });
    expect(s.getState().user.expiresAt).toBeLessThanOrEqual(Date.now() + DEMO_TTL);
    const request = vi.mocked(fetch).mock.calls[0]![0] as Request;
    expect(await request.json()).toEqual(credentials);
    expect(vi.mocked(fetch).mock.calls[1]![0]).toHaveProperty('url', 'http://localhost:5178/api/auth/me');
  });
  it('restores a tab session through /me without extending its deadline', async () => {
    const saved = { token: token(), expiresAt: Date.now() + 120000 };
    saveSession(saved); mockLogin(saved.token);
    const s = makeStore();
    const pending = s.dispatch(restoreSession());
    expect(s.getState().user.status).toBe('initializing');
    expect(s.getState().user.user).toBeNull();
    await pending;
    expect(s.getState().user.status).toBe('authenticated');
    expect(s.getState().user.expiresAt).toBe(saved.expiresAt);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it.each(['expired', 'malformed', 'overlong'])('rejects %s storage without a request', async kind => {
    sessionStorage.setItem(SESSION_KEY, kind === 'malformed' ? '{' : JSON.stringify({ token: token(), expiresAt: Date.now() + (kind === 'expired' ? -1 : DEMO_TTL * 2) }));
    vi.stubGlobal('fetch', vi.fn());
    const s = makeStore(); await s.dispatch(restoreSession());
    expect(s.getState().user.status).toBe('anonymous'); expect(fetch).not.toHaveBeenCalled();
    expect(readSession()).toBeNull();
  });
  it.each([401, 429, 500])('fails closed on restore status %s', async status => {
    saveSession({ token: token(), expiresAt: Date.now() + 60000 });
    vi.stubGlobal('fetch', vi.fn(async () => failure(status)));
    const s = makeStore(); await s.dispatch(restoreSession());
    expect(s.getState().user.token).toBeNull(); expect(s.getState().user.user).toBeNull();
  });
  it.each([token(-10), 'malformed'])('rejects invalid issued tokens before /me', async jwt => {
    mockLogin(jwt); const s = makeStore(); await s.dispatch(login(credentials));
    expect(s.getState().user.status).toBe('anonymous'); expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('ignores a late login response after logout and clears identity immediately on account switch', async () => {
    mockLogin(); const s = makeStore(); await s.dispatch(login(credentials));
    let resolve!: (response: Response) => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(done => { resolve = done; })));
    const pending = s.dispatch(login({ ...credentials, identifier: 'b@example.test' }));
    expect(s.getState().user.user).toBeNull();
    s.dispatch(logout());
    await waitFor(() => expect(resolve).toBeTypeOf('function'));
    resolve(failure(401)); await pending;
    expect(s.getState().user.status).toBe('anonymous'); expect(s.getState().user.error).toBeNull();
  });
  it('clears legacy storage, persists a bounded tab session and expires without traffic', async () => {
    localStorage.setItem('token', 'legacy'); localStorage.setItem('shoppingCart', '[{"private":true}]');
    sessionStorage.setItem('clu.checkout.intent', 'old-account');
    mockLogin(); await store.dispatch(login(credentials));
    expect(localStorage.getItem('token')).toBeNull(); expect(localStorage.getItem('shoppingCart')).toBeNull();
    expect(sessionStorage.getItem('clu.checkout.intent')).toBeNull(); expect(readSession()).not.toBeNull();
    vi.useFakeTimers();
    // The request boundary also checks time after a suspended tab resumes.
    vi.setSystemTime(Date.now() + DEMO_TTL + 1);
    await expect(cartService.get({ token: store.getState().user.token })).rejects.toThrow('Session expired');
    expect(store.getState().user.user).toBeNull(); expect(readSession()).toBeNull();
  });
  it('invalidates the active session on authenticated 401, but keeps it on 403', async () => {
    mockLogin(); await store.dispatch(login(credentials)); const jwt = store.getState().user.token;
    vi.stubGlobal('fetch', vi.fn(async () => failure(403)));
    await expect(cartService.get({ token: jwt })).rejects.toThrow(); expect(store.getState().user.token).toBe(jwt);
    vi.stubGlobal('fetch', vi.fn(async () => failure(401)));
    await expect(cartService.get({ token: jwt })).rejects.toThrow(); expect(store.getState().user.token).toBeNull();
  });
  it('does not render protected data before validation and redirects anonymous users', async () => {
    const s = makeStore();
    render(<Provider store={s}><MemoryRouter initialEntries={['/checkout?source=cart']}><Routes>
      <Route path="/checkout" element={<RequireAuth><p>Private checkout</p></RequireAuth>} />
      <Route path="/auth/signin" element={<p>Login required</p>} />
    </Routes></MemoryRouter></Provider>);
    expect(screen.queryByText('Private checkout')).toBeNull();
    act(() => { s.dispatch(logout()); });
    expect(await screen.findByText('Login required')).toBeTruthy();
  });
  it('accepts a username login and returns to the requested route', async () => {
    mockLogin(); const s = makeStore(); s.dispatch(logout());
    render(<Provider store={s}><MemoryRouter initialEntries={[{ pathname: '/auth/signin', state: { from: '/checkout?source=cart' } }]}><Routes>
      <Route path="/auth/signin" element={<SignIn />} /><Route path="/checkout" element={<p>Checkout destination</p>} />
    </Routes></MemoryRouter></Provider>);
    fireEvent.change(screen.getByLabelText('用户名或邮箱'), { target: { value: 'alice' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'synthetic-password' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));
    expect(await screen.findByText('Checkout destination')).toBeTruthy();
    expect(await (vi.mocked(fetch).mock.calls[0]![0] as Request).json()).toEqual({ identifier: 'alice', password: 'synthetic-password' });
  });
  it.each(['//evil.test', 'https://evil.test', '/\\evil.test', '/auth/signin', '/\nevil'])('rejects unsafe return path %s', value => {
    expect(safeReturnPath(value)).toBe('/');
  });
  it.each([[409, '用户名或邮箱已注册。'], [429, '尝试过于频繁，请稍后重试。'], [500, '认证失败，请重试。']])('shows a safe registration error for %s', async (status, message) => {
    vi.stubGlobal('fetch', vi.fn(async () => failure(Number(status))));
    render(<MemoryRouter><Register /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText('yourname'), { target: { value: 'alice' } });
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'a@example.test' } });
    screen.getAllByPlaceholderText('••••••••').forEach(input => fireEvent.change(input, { target: { value: 'synthetic-password' } }));
    fireEvent.click(screen.getByRole('button', { name: '注册' }));
    expect((await screen.findByRole('alert')).textContent).toBe(message);
  });
});

it('expires the active session on its timer and removes persisted credentials', async () => {
  vi.useFakeTimers(); mockLogin();
  await store.dispatch(login(credentials));
  expect(store.getState().user.status).toBe('authenticated');
  await vi.advanceTimersByTimeAsync(DEMO_TTL);
  expect(store.getState().user.status).toBe('anonymous');
  expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
});
it('does not let a successful stale login restore identity after logout', () => {
  const s = makeStore();
  s.dispatch(login.pending('old-request', credentials));
  s.dispatch(logout());
  s.dispatch(login.fulfilled({ token: token(), expiresAt: Date.now() + 1000,
    user: { id: user.id, username: user.username, email: user.email, role: 'USER' } }, 'old-request', credentials));
  expect(s.getState().user.user).toBeNull();
});
it('does not let an older login overwrite the new account', () => {
  const s = makeStore();
  s.dispatch(login.pending('old-request', credentials));
  s.dispatch(login.pending('new-request', credentials));
  const account = { token: token(), expiresAt: Date.now() + 1000,
    user: { id: 'account-b', username: 'B', email: 'b@example.test', role: 'USER' as const } };
  s.dispatch(login.fulfilled(account, 'new-request', credentials));
  s.dispatch(login.fulfilled({ ...account, user: { ...account.user, id: 'account-a' } }, 'old-request', credentials));
  expect(s.getState().user.user?.id).toBe('account-b');
});
it('ignores an old account 401 after switching accounts', async () => {
  mockLogin(token(3600)); await store.dispatch(login(credentials));
  const firstToken = store.getState().user.token;
  let resolve!: (response: Response) => void;
  vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(done => { resolve = done; })));
  const oldRequest = cartService.get({ token: firstToken }).catch(() => {});
  await waitFor(() => expect(resolve).toBeTypeOf('function'));
  mockLogin(token(1800), { ...user, id: 'account-b' }); await store.dispatch(login(credentials));
  resolve(failure(401)); await oldRequest;
  expect(store.getState().user.user?.id).toBe('account-b');
});

it('preserves a same-session checkout retry key when restoration completes', () => {
  sessionStorage.setItem('clu.checkout.intent', 'retry-same-order');
  store.dispatch(restoreSession.pending('restore-test', undefined));
  store.dispatch(restoreSession.fulfilled({ token: token(), expiresAt: Date.now() + 10000,
    user: { id: user.id, username: user.username, email: user.email, role: 'USER' } }, 'restore-test', undefined));
  expect(sessionStorage.getItem('clu.checkout.intent')).toBe('retry-same-order');
  store.dispatch(logout());
  expect(sessionStorage.getItem('clu.checkout.intent')).toBeNull();
});
it('continues in memory if browser storage rejects writes', async () => {
  const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage disabled'); });
  mockLogin(); await store.dispatch(login(credentials));
  expect(store.getState().user.status).toBe('authenticated');
  store.dispatch(logout());
  expect(store.getState().user.user).toBeNull();
  setItem.mockRestore();
});
it.each([[401, 'auth.invalidCredentials'], [429, 'auth.rateLimit'], [500, 'auth.serverError']])('handles login failure %s without retaining a session', async (status, key) => {
  vi.stubGlobal('fetch', vi.fn(async () => failure(Number(status))));
  const s = makeStore(); await s.dispatch(login(credentials));
  expect(s.getState().user.error).toBe(key);
  expect(s.getState().user.token).toBeNull();
});

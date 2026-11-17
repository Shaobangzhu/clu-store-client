import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });
it('rejects a remote API base', async () => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://outside.test/api');
  vi.resetModules();
  const { API_BASE_URL } = await import('../src/helpers/api');
  expect(API_BASE_URL).toBe('/api');
});
it('preserves method, body, authorization, and cancellation with a custom same-origin mount', async () => {
  vi.stubEnv('VITE_API_BASE_URL', '/gateway/api');
  vi.resetModules();
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: true, data: { token: 'synthetic-token' }, meta: null }), {
    headers: { 'Content-Type': 'application/json' },
  })));
  const { authService } = await import('../src/api/services');
  const controller = new AbortController();
  await authService.login({ identifier: 'synthetic', password: 'synthetic-password' }, { token: 'synthetic-token', signal: controller.signal });
  const request = vi.mocked(fetch).mock.calls[0]?.[0];
  if (!(request instanceof Request)) throw new Error('Missing request');
  expect(request.url).toBe('http://localhost:5178/gateway/api/auth/login');
  expect(request.method).toBe('POST');
  expect(request.headers.get('Authorization')).toBe('Bearer synthetic-token');
  expect(await request.json()).toEqual({ identifier: 'synthetic', password: 'synthetic-password' });
  controller.abort();
  expect(request.signal.aborted).toBe(true);
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, mediaUrl } from '../src/helpers/api';
import { authService, cartService, catalogService, orderService } from '../src/api/services';
import { toProduct, toCartItem, toCategory } from '../src/api/adapters';
import contract from '../src/api/openapi.json';

const json = (body: unknown, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'X-Request-Id': 'server-request', ...headers },
});
const respond = (body: unknown, status = 200, headers = {}) => vi.stubGlobal('fetch', vi.fn(async () => json(body, status, headers)));
afterEach(() => vi.unstubAllGlobals());

describe('typed API boundary', () => {
  it('unwraps success and preserves paging metadata and server request IDs', async () => {
    const meta = { page: 2, pageSize: 1, total: 4, totalPages: 4 };
    respond({ success: true, data: [], meta });
    const result = await catalogService.products({ page: '2', pageSize: '1', keyword: 'a & b' });
    expect(result).toEqual({ data: [], meta, status: 200, requestId: 'server-request' });
    const request = vi.mocked(fetch).mock.calls[0]?.[0];
    expect(request).toBeInstanceOf(Request);
    if (!(request instanceof Request)) throw new Error('Missing request');
    expect(new URL(request.url).searchParams.get('keyword')).toBe('a & b');
  });
  it('retains cursor metadata', async () => {
    const meta = { pageSize: 1, hasMore: true, nextCursor: 'cursor', sort: 'newest' };
    respond({ success: true, data: [], meta });
    expect((await orderService.list({ pageSize: '1' }, { token: 'synthetic-token' })).meta).toEqual(meta);
  });
  it('sends bearer and caller request IDs, preserving the authoritative server ID', async () => {
    respond({ success: true, data: { id: 'synthetic' }, meta: null });
    const result = await authService.me({ token: 'synthetic-token', requestId: 'caller-request' });
    const request = vi.mocked(fetch).mock.calls[0]?.[0];
    if (!(request instanceof Request)) throw new Error('Missing request');
    expect(request.headers.get('Authorization')).toBe('Bearer synthetic-token');
    expect(request.headers.get('X-Request-Id')).toBe('caller-request');
    expect(result.requestId).toBe('server-request');
  });
  it('handles bodyless 204 for remove and clear without parsing JSON', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 204 })));
    expect(await cartService.remove(7, {})).toEqual({ data: undefined, meta: null, status: 204, requestId: null });
    expect((await cartService.clear({})).data).toBeUndefined();
  });
  it.each([401, 403, 409, 422, 429])('preserves structured %i errors, details and retry headers', async status => {
    const details = [{ path: ['qty'], code: 'too_big' }];
    respond({ success: false, error: { code: 'TEST_ERROR', message: 'Request rejected', details } }, status, { 'Retry-After': '30' });
    await expect(cartService.get({})).rejects.toMatchObject({ name: 'ApiError', status, code: 'TEST_ERROR',
      message: 'Request rejected', details, requestId: 'server-request', retryAfter: '30' });
  });
  it('normalizes proxy HTML, malformed JSON, and invalid envelopes', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>bad gateway</html>', { status: 502 })));
    await expect(catalogService.products()).rejects.toMatchObject({ status: 502, code: 'HTTP_ERROR' });
    respond({ unexpected: true });
    await expect(catalogService.products()).rejects.toBeInstanceOf(ApiError);
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{', { headers: { 'Content-Type': 'application/json' } })));
    await expect(catalogService.products()).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });
  it('passes cancellation to fetch and preserves AbortError', async () => {
    vi.stubGlobal('fetch', vi.fn((request: Request) => new Promise((_resolve, reject) => {
      if (request.signal.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
      request.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    })));
    const controller = new AbortController();
    const pending = catalogService.products(undefined, { signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
  });
  it('sends the same idempotency key on a checkout retry and supports 200 replay', async () => {
    respond({ success: true, data: { id: 7 }, meta: null });
    await orderService.place({}, 'purchase-intent', {});
    await orderService.place({}, 'purchase-intent', {});
    for (const [request] of vi.mocked(fetch).mock.calls) {
      if (!(request instanceof Request)) throw new Error('Missing request');
      expect(request.headers.get('Idempotency-Key')).toBe('purchase-intent');
      expect(await request.json()).toEqual({});
    }
  });
});

describe('media and display adapters', () => {
  it.each(['/media/demo-placeholder.svg', '/media/products/item.jpg'])('keeps media on the current origin: %s', value => {
    expect(mediaUrl(value)).toBe(value);
  });
  it.each([null, undefined, '', '//outside.test/media/a', 'https://outside.test/media/a', '/media/../a', '/media/%2e%2e/a', '/media/a?x=1', 'javascript:alert(1)'])('rejects non-contract media: %s', value => {
    expect(mediaUrl(value)).toBe('');
  });
  it('maps real product, category and cart examples to existing display models', () => {
    const product = contract.paths['/api/products/{id}'].get.responses['200'].content['application/json'].example.data;
    const adapted = toProduct(product);
    expect(adapted.startingPrice).toBe(product.startingPrice);
    expect(adapted.models[0]?.price).toBe(product.models[0]?.price);
    expect(adapted.colors).toEqual(product.colors);
    const cart = contract.paths['/api/shopping-cart'].get.responses['200'].content['application/json'].example.data;
    const first = cart.items[0];
    if (!first) throw new Error('Contract cart example must contain an item');
    if (first.currency !== 'CNY') throw new Error('Invalid fixture currency');
    expect(toCartItem({ ...first, currency: first.currency }).price).toBe(Number(first.unitPrice));
    const category = contract.paths['/api/categories/{title}'].get.responses['200'].content['application/json'].example.data;
    expect(toCategory(category).title).toBe(category.title);
  });
});

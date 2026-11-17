import { sessionTransport } from '../auth/session';
import createClient from 'openapi-fetch';
import type { components, paths } from '../api/schema';

// Browser requests always use the Vite/reverse proxy on the current origin.
const configuredBase = import.meta.env.VITE_API_BASE_URL || '/api';
export const API_BASE_URL = /^\/(?!\/)[A-Za-z0-9/_-]*$/.test(configuredBase)
  ? configuredBase.replace(/\/+$/, '') : '/api';
export const apiUrl = (path: string) => `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;

export interface RequestOptions {
  token?: string | null;
  signal?: AbortSignal;
  requestId?: string;
}
export interface ApiResult<T, M = null> {
  data: T;
  meta: M;
  status: number;
  requestId: string | null;
}
type ErrorEnvelope = components['schemas']['ErrorEnvelope'];

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details: unknown,
    readonly requestId: string | null,
    readonly retryAfter: string | null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
export const requestOptions = ({ token, signal, requestId }: RequestOptions = {}) => ({
  signal,
  headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(requestId ? { 'X-Request-Id': requestId } : {}),
  },
});

export const apiClient = createClient<paths>({
  baseUrl: globalThis.location?.origin ?? '',
  fetch: (request) => globalThis.fetch(request),
});
// Keep non-JSON failures (for example a proxy's HTML 502) inside the error boundary.
apiClient.use({
  async onRequest({ request }) {
    const token = request.headers.get('Authorization')?.replace(/^Bearer /, '');
    if (token && !sessionTransport.allowed(token)) {
      sessionTransport.invalid(token);
      throw new ApiError(401, 'TOKEN_EXPIRED', 'Session expired', null, null, null);
    }
    if (API_BASE_URL === '/api') return request;
    const url = new URL(request.url);
    url.pathname = API_BASE_URL + url.pathname.slice(4);
    return new Request(url.href, { method: request.method, headers: request.headers,
      signal: request.signal, credentials: request.credentials,
      body: request.body ? await request.arrayBuffer() : undefined });
  },
  async onResponse({ response, request }) {
    const token = request.headers.get('Authorization')?.replace(/^Bearer /, '');
    if (response.status === 401 && token) sessionTransport.invalid(token);
    if (response.status === 204) return response;
    let body: unknown;
    try { body = await response.clone().json(); }
    catch {
      throw new ApiError(response.status, response.ok ? 'INVALID_RESPONSE' : 'HTTP_ERROR',
        response.ok ? 'Invalid API response' : `Request failed (${response.status})`, null,
        response.headers.get('X-Request-Id'), response.headers.get('Retry-After'));
    }
    const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
    if (!response.ok || (record(body) && body.success === false)) {
      const error = record(body) && record(body.error) ? body.error : undefined;
      throw new ApiError(response.status, typeof error?.code === 'string' ? error.code : 'HTTP_ERROR',
        typeof error?.message === 'string' ? error.message : `Request failed (${response.status})`, error?.details ?? null,
        response.headers.get('X-Request-Id'), response.headers.get('Retry-After'));
    }
    if (!record(body) || body.success !== true || !('data' in body) || !('meta' in body)) {
      throw new ApiError(response.status, 'INVALID_RESPONSE', 'Invalid API success envelope', null,
        response.headers.get('X-Request-Id'), null);
    }
    return response;
  },
});

interface ClientResponse<T> {
  data?: T;
  error?: ErrorEnvelope;
  response: Response;
}
function checkResponse(result: ClientResponse<unknown>) {
  const { response, error } = result;
  if (!response.ok || error) {
    throw new ApiError(response.status, error?.error.code ?? 'HTTP_ERROR',
      error?.error.message ?? `Request failed (${response.status})`, error?.error.details ?? null,
      response.headers.get('X-Request-Id'), response.headers.get('Retry-After'));
  }
}
export async function readResponse<T, M>(pending: Promise<ClientResponse<{ success: true; data: T; meta: M }>>): Promise<ApiResult<T, M>> {
  const result = await pending;
  checkResponse(result);
  if (!result.data || result.data.success !== true) {
    throw new ApiError(result.response.status, 'INVALID_RESPONSE', 'Invalid API success envelope', null,
      result.response.headers.get('X-Request-Id'), null);
  }
  return { data: result.data.data, meta: result.data.meta, status: result.response.status,
    requestId: result.response.headers.get('X-Request-Id') };
}
export async function emptyResponse(pending: Promise<ClientResponse<unknown>>): Promise<ApiResult<undefined>> {
  const result = await pending;
  checkResponse(result);
  return { data: undefined, meta: null, status: result.response.status,
    requestId: result.response.headers.get('X-Request-Id') };
}

export function mediaUrl(value: string | null | undefined): string {
  if (!value || !/^\/media\/[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(value)
    || value.split('/').some(segment => segment === '.' || segment === '..')) return '';
  return value;
}

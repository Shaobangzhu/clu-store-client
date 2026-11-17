import { apiClient as client, readResponse, emptyResponse, requestOptions } from '../helpers/api';
import type { RequestOptions } from '../helpers/api';
import type { components, operations } from './schema';
type Schemas = components['schemas'];
export type ProductDto = Schemas['productResponse200']['data'];
export type CartDto = Schemas['cartResponse200']['data'];
export type OrderDto = Schemas['orderResponse200']['data'];

export const authService = {
  login: (body: Schemas['loginRequest'], options?: RequestOptions) =>
    readResponse(client.POST('/api/auth/login', { body, ...requestOptions(options) })),
  register: (body: Schemas['registerRequest'], options?: RequestOptions) =>
    readResponse(client.POST('/api/auth/register', { body, ...requestOptions(options) })),
  me: (options: RequestOptions) => readResponse(client.GET('/api/auth/me', requestOptions(options))),
};
export const catalogService = {
  products: (query?: operations['products']['parameters']['query'], options?: RequestOptions) =>
    readResponse(client.GET('/api/products', { params: { query }, ...requestOptions(options) })),
  product: (id: number, options?: RequestOptions) =>
    readResponse(client.GET('/api/products/{id}', { params: { path: { id: String(id) } }, ...requestOptions(options) })),
  categories: (options?: RequestOptions) => readResponse(client.GET('/api/categories', requestOptions(options))),
  category: (title: string, options?: RequestOptions) =>
    readResponse(client.GET('/api/categories/{title}', { params: { path: { title } }, ...requestOptions(options) })),
  offers: (options?: RequestOptions) => readResponse(client.GET('/api/products/offers', requestOptions(options))),
  arrivals: (options?: RequestOptions) => readResponse(client.GET('/api/products/newarrivals', requestOptions(options))),
  support: (options?: RequestOptions) => readResponse(client.GET('/api/information/support', requestOptions(options))),
};
export const cartService = {
  get: (options: RequestOptions) => readResponse(client.GET('/api/shopping-cart', requestOptions(options))),
  add: (body: Schemas['addCartItemRequest'], options: RequestOptions) =>
    readResponse(client.POST('/api/shopping-cart/items', { body, ...requestOptions(options) })),
  update: (id: number, body: Schemas['updateCartItemRequest'], options: RequestOptions) =>
    readResponse(client.PATCH('/api/shopping-cart/items/{id}', { params: { path: { id: String(id) } }, body, ...requestOptions(options) })),
  remove: (id: number, options: RequestOptions) =>
    emptyResponse(client.DELETE('/api/shopping-cart/items/{id}', { params: { path: { id: String(id) } }, ...requestOptions(options) })),
  clear: (options: RequestOptions) => emptyResponse(client.DELETE('/api/shopping-cart/items', requestOptions(options))),
};
export const orderService = {
  place: (body: Schemas['placeRequest'], idempotencyKey: string, options: RequestOptions) => {
    const init = requestOptions(options);
    return readResponse(client.POST('/api/orders/place', { body, ...init,
      headers: { ...init.headers, 'Idempotency-Key': idempotencyKey } }));
  },
  list: (query: operations['ownOrders']['parameters']['query'], options: RequestOptions) =>
    readResponse(client.GET('/api/orders', { params: { query }, ...requestOptions(options) })),
  get: (id: number, options: RequestOptions) =>
    readResponse(client.GET('/api/orders/{id}', { params: { path: { id: String(id) } }, ...requestOptions(options) })),
};

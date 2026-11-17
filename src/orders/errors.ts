import { ApiError } from '../helpers/api';
export function orderError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'checkout.sessionExpired';
    if (error.status === 403) return 'orders.forbidden';
    if (error.status === 404) return 'order.notFound';
    if (error.status === 409) return 'orders.conflict';
    if (error.status === 400 || error.status === 422) return 'orders.invalid';
  }
  return 'order.failed';
}

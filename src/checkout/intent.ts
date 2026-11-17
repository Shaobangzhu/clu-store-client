import type { CartDto } from '../api/services';
import { CART_LIMITS, validQuantity } from '../api/cart';
import { ApiError } from '../helpers/api';

export const CHECKOUT_TIMEOUT_MS = 30_000;
export const intentStorageKey = (userId: string) => `clu.checkout.intent.v1:${userId}`;
type IntentBase = { version: 1; userId: string; key: string };
export type CheckoutIntent = IntentBase & (
  | { state: 'unresolved' | 'review' | 'conflict' }
  | { state: 'confirmed'; orderId: number }
);
const validKey = (key: unknown): key is string => typeof key === 'string'
  && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(key);
export const validOrderId = (id: unknown): id is number => typeof id === 'number'
  && Number.isInteger(id) && id > 0 && id <= 2147483647;

// Account-scoped tab storage survives reload and reauthentication; it contains no credentials.
// Never fall back to memory: losing an unresolved key could duplicate a purchase.
export function readIntent(userId: string): CheckoutIntent | null {
  const raw = sessionStorage.getItem(intentStorageKey(userId));
  if (raw === null) {
    // Preserve a retry left by the previous checkout in this authenticated session.
    const legacy = sessionStorage.getItem('clu.checkout.intent');
    if (legacy === null) return null;
    if (!validKey(legacy)) throw new Error('Invalid saved checkout intent');
    return { version: 1, userId, key: legacy, state: 'unresolved' };
  }
  const value: unknown = JSON.parse(raw);
  if (typeof value !== 'object' || !value || !('version' in value) || value.version !== 1
    || !('userId' in value) || value.userId !== userId || !('key' in value) || !validKey(value.key)
    || !('state' in value)) throw new Error('Invalid saved checkout intent');
  const base: IntentBase = { version: 1, userId, key: value.key };
  if (value.state === 'confirmed' && 'orderId' in value && validOrderId(value.orderId)) {
    return { ...base, state: 'confirmed', orderId: value.orderId };
  }
  if (value.state === 'unresolved' || value.state === 'review' || value.state === 'conflict') {
    return { ...base, state: value.state };
  }
  throw new Error('Invalid saved checkout intent');
}
export function saveIntent(intent: CheckoutIntent) {
  const value = JSON.stringify(intent);
  sessionStorage.setItem(intentStorageKey(intent.userId), value);
  if (sessionStorage.getItem(intentStorageKey(intent.userId)) !== value) throw new Error('Checkout storage unavailable');
  sessionStorage.removeItem('clu.checkout.intent');
}
export function finishIntent(userId: string) {
  // Only an explicit new-purchase action after confirmed success may discard a key.
  sessionStorage.removeItem(intentStorageKey(userId));
  if (sessionStorage.getItem(intentStorageKey(userId)) !== null) throw new Error('Checkout storage unavailable');
}
export function validCheckoutCart(cart: CartDto | null): boolean {
  return !!cart && cart.items.length > 0 && cart.items.length <= CART_LIMITS.configurations
    && cart.totalQty > 0 && cart.totalQty <= CART_LIMITS.total
    && cart.items.every(item => item.available && validQuantity(item.qty)
      && [item.id, item.product.id, item.model.id, item.memorySize.id].every(validOrderId) && !!item.color.trim());
}
export function placementFailure(failure: unknown): { state: 'unresolved' | 'review' | 'conflict'; message: string } {
  if (failure instanceof ApiError) {
    if (failure.status === 409) return { state: 'conflict', message: 'checkout.conflict' };
    if (failure.status === 422) return { state: 'review', message: failure.code === 'EMPTY_CART' ? 'checkout.emptyRejected' : 'checkout.invalidRejected' };
    if (failure.status === 401) return { state: 'unresolved', message: 'checkout.sessionExpired' };
    if (failure.status === 429) return { state: 'unresolved', message: 'checkout.rateLimited' };
    if (failure.code === 'CHECKOUT_BUSY') return { state: 'unresolved', message: 'checkout.serverBusy' };
    if (failure.status === 403) return { state: 'unresolved', message: 'checkout.forbidden' };
  }
  return { state: 'unresolved', message: 'checkout.uncertain' };
}

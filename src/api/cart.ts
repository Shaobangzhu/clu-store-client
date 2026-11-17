import type { components } from './schema';
import type { CartDto } from './services';
import { ApiError } from '../helpers/api';

export type CartInput = Pick<components['schemas']['addCartItemRequest'],
  'productId' | 'modelId' | 'memorySizeId' | 'color' | 'qty'>;
export type CartLine = CartDto['items'][number];
// Limits documented by POST /shopping-cart/items and PATCH /shopping-cart/items/{id}.
export const CART_LIMITS = { line: 99, configurations: 50, total: 500 };
export const validQuantity = (qty: number) => Number.isInteger(qty) && qty >= 1 && qty <= CART_LIMITS.line;
export const sameSku = (line: CartLine, input: CartInput) => line.product.id === input.productId
  && line.model.id === input.modelId && line.memorySize.id === input.memorySizeId && line.color === input.color;

export function cartError(failure: unknown): string {
  if (failure instanceof ApiError) {
    if (failure.status === 401) return 'cart.signIn';
    if (failure.code === 'CART_LIMIT_EXCEEDED') return 'cart.limit';
    if (['PRODUCT_UNAVAILABLE', 'INVALID_PRODUCT_CONFIGURATION', 'INVALID_CART', 'PRODUCT_NOT_FOUND'].includes(failure.code)) return 'cart.unavailableError';
    if (failure.code === 'CART_ITEM_NOT_FOUND') return 'cart.missing';
    if (failure.status === 429) return 'cart.rateLimited';
  }
  return 'cart.failed';
}

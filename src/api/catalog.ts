import type { Product } from '../types/custom';
import type { CartInput } from './cart';

// Integer fen arithmetic avoids floating-point price previews and preserves large amounts.
function fen(value: string): bigint {
  if (!/^\d+\.\d{2}$/.test(value)) throw new Error('Invalid CNY amount');
  return BigInt(value.replace('.', ''));
}
export function addMoney(base: string, increment: string): string {
  const total = fen(base) + fen(increment);
  return `${total / 100n}.${String(total % 100n).padStart(2, '0')}`;
}
export function formatMoney(value: string): string {
  const [whole, fraction] = addMoney(value, '0.00').split('.');
  return `RMB ${whole!.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${fraction}`;
}
export function previewPrice(product: Product, modelId?: number, memorySizeId?: number): string {
  const models = product.models.filter(model => model.inStock);
  const sizes = product.memorySizes.filter(size => size.inStock);
  const cheapest = <T extends { price: string }>(items: T[]) => items.reduce<T | undefined>(
    (best, item) => !best || fen(item.price) < fen(best.price) ? item : best, undefined);
  const model = models.find(item => item.id === modelId) ?? cheapest(models);
  const memory = sizes.find(item => item.id === memorySizeId) ?? cheapest(sizes);
  return model && memory ? addMoney(model.price, memory.price) : product.startingPrice;
}
export function canPurchase(product: Product): boolean {
  return product.inStock && product.models.some(model => model.inStock)
    && product.memorySizes.some(size => size.inStock) && product.colors.length > 0;
}
export function selectedCartItem(product: Product, modelId?: number, color?: string, memorySizeId?: number): CartInput | null {
  const model = product.models.find(item => item.id === modelId && item.inStock);
  const memory = product.memorySizes.find(item => item.id === memorySizeId && item.inStock);
  if (!product.inStock || !model || !memory || !color || !product.colors.includes(color)) return null;
  return { productId: product.id, modelId: model.id, memorySizeId: memory.id, color, qty: 1 };
}

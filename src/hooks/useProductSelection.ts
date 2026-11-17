import { useState } from 'react';
import type { Product } from '../types/custom';
import { previewPrice, selectedCartItem } from '../api/catalog';

type Selection = { productId: number; modelId?: number; color?: string; memorySizeId?: number };
export default function useProductSelection(product: Product) {
  const [selection, setSelection] = useState<Selection>({ productId: product.id });
  // A reused route/component must never carry another product's SKU into a purchase.
  const current = selection.productId === product.id ? selection : { productId: product.id };
  return { ...current,
    select: (updates: Partial<Omit<Selection, 'productId'>>) => setSelection({ ...current, ...updates }),
    price: previewPrice(product, current.modelId, current.memorySizeId),
    cartItem: selectedCartItem(product, current.modelId, current.color, current.memorySizeId),
  };
}

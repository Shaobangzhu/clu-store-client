import { mediaUrl } from '../helpers/api';
import type { CartDto, ProductDto } from './services';
import type { CartItem, Product, Category } from '../types/custom';
import type { components } from './schema';

// Catalog money remains decimal strings. Only the legacy cart display uses numbers.
export function toProduct(dto: ProductDto): Product {
  return { ...dto, image: mediaUrl(dto.image), carouselImages: (dto.carouselImages ?? []).map(mediaUrl).filter(Boolean) };
}
export function toCartItem(dto: CartDto['items'][number]): CartItem {
  return { id: dto.id, productId: dto.product.id, name: dto.product.name, imageSrc: mediaUrl(dto.product.image),
    modelId: dto.model.id, model: dto.model.name, modelPrice: Number(dto.model.price),
    memorySizeId: dto.memorySize.id, memorySize: dto.memorySize.name, memorySizePrice: Number(dto.memorySize.price),
    color: dto.color, qty: dto.qty, price: Number(dto.unitPrice) };
}
export function toCategory(dto: components['schemas']['categoryResponse200']['data']): Category {
  return { ...dto, subTitle: dto.subTitle ?? '',
    videos: { id: dto.videos?.id ?? 0, regularSrc: mediaUrl(dto.videos?.regularSrc), smallSrc: mediaUrl(dto.videos?.smallSrc) },
    features: dto.features.map(feature => ({ ...feature, image: mediaUrl(feature.image) })),
    products: dto.products.map(product => ({ ...product, image: mediaUrl(product.image) })),
  };
}
export function positiveId(value: string | number | null): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('A positive catalog ID is required');
  return id;
}

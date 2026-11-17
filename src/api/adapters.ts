import { mediaUrl } from '../helpers/api';
import type { ProductDto } from './services';
import type { Product, Category } from '../types/custom';
import type { components } from './schema';

// Catalog money remains decimal strings.
export function toProduct(dto: ProductDto): Product {
  return { ...dto, image: mediaUrl(dto.image), carouselImages: (dto.carouselImages ?? []).map(mediaUrl).filter(Boolean) };
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

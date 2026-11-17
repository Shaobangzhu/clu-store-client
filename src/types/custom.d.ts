// Display models only. Transport DTOs are generated in api/schema.d.ts.
// 定义模型信息
import type { components } from '../api/schema';
type Schemas = components['schemas'];
export type ProductModel = Product['models'][number];

// 定义 MemorySize 类型
export type MemorySize = Product['memorySizes'][number];

export type Color = string;

// 定义 Phone 产品的类型
export type Product = Schemas['productResponse200']['data'];

interface CartItem {
  id?: number;
  productId: string | number;
  name: string;
  imageSrc: string;

  modelId: string | number | null;
  model: string | null;
  modelPrice: number | null;

  color: string | null;

  memorySizeId: string | number | null;
  memorySize: string | null;
  memorySizePrice: number | null;

  price: number;
  qty: number;
}

export interface Video {
  id: number;
  regularSrc: string;
  smallSrc: string;
}

export interface Feature {
  id: number;
  title: string;
  detail: string;
  image: string;
  textColor: string;
}

export type ProductInCategory = Schemas['categoryResponse200']['data']['products'][number];

export interface Category {
  id: number;
  title: string;
  slug: string;
  subTitle: string;
  videos: Video;
  features: Feature[];
  products: ProductInCategory[];
}

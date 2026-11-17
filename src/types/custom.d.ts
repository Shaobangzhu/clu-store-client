// Display models only. Transport DTOs are generated in api/schema.d.ts.
// 定义模型信息
export interface ProductModel {
  id: string | number;
  name: string;
  specification: string;
  price: number;
}

// 定义 MemorySize 类型
export interface MemorySize {
  id: string | number;
  name: string;
  price: number;
}

export type Color = string;

// 定义 Phone 产品的类型
export interface Product {
  id: number;
  name: string;
  title: string;
  image: string;
  carouselImages: string[];
  startingPrice: number;
  installments: number | null;
  models: ProductModel[];
  colors: Color[];
  memorySizes: MemorySize[];
  features: string[];
  inStock: boolean;
  category?: string;
}

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

export interface ProductInCategory {
  id: number;
  name: string;
  title: string;
  image: string;
  startingPrice: number;
  installments: number | null;
  features: string[];
}

export interface Category {
  id: number;
  title: string;
  subTitle: string;
  videos: Video;
  features: Feature[];
  products: ProductInCategory[];
}

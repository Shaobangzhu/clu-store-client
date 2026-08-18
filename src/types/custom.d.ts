// 定义模型信息
export interface ProductModel {
  id: string | number;
  name: string;
  specification: string;
  price: number;
}

// 定于MemorySize类型
export interface MemorySize {
  id: string | number;
  name: string;
  price: number;
}

export type Color = string;

// 定义 Phone 产品类型
export interface Product {
  id: number;
  name: string;
  title: string;
  image: string;
  carouselImages: string[];
  startingPrice: number;
  installments: number;
  models: ProductModel[];
  colors: Color[];
  memorySizes: MemorySize[];
  features: string[];
  inStock: boolean;
  category?: string;
}

export interface CartItem {
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
  qty: number | null;
}

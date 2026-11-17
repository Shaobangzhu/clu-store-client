import { catalogService } from '../api/services';
import { positiveId, toProduct } from '../api/adapters';
export const loadProducts = async (productId: string | number, signal?: AbortSignal) =>
  toProduct((await catalogService.product(positiveId(productId), { signal })).data);

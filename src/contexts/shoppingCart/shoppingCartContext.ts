import { createContext } from 'react';
import type { CartDto } from '../../api/services';
import type { CartInput, CartLine } from '../../api/cart';

export interface ShoppingCartContextType {
  cart: CartDto | null;
  cartItems: CartLine[];
  authenticated: boolean;
  busy: boolean;
  ready: boolean;
  error: string | null;
  addToCart: (item: CartInput) => Promise<boolean>;
  removeFromCart: (id: number) => Promise<boolean>;
  updateItem: (id: number, qty: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<boolean>;
}
export const defaultShoppingCartContext: ShoppingCartContextType = {
  cart: null, cartItems: [], authenticated: false, busy: false, ready: false, error: null,
  addToCart: async () => false, removeFromCart: async () => false,
  updateItem: async () => false, clearCart: async () => false, refreshCart: async () => false,
};
export default createContext<ShoppingCartContextType>(defaultShoppingCartContext);

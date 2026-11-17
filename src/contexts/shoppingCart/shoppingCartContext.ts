import type { CartItem } from "@/types/custom";
import { createContext } from "react";

interface ShoppingCartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateItem: (index: number, newItem: CartItem) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const defaultShoppingCartContext: ShoppingCartContextType = {
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateItem: () => {},
  clearCart: () => {},
  refreshCart: async () => {},
};

const ShoppingCartContext = createContext<ShoppingCartContextType>(
  defaultShoppingCartContext,
);

export default ShoppingCartContext;

import type { CartItem, AddCartItemInput } from "@/types/custom";
import { createContext } from "react";

interface ShoppingCartContextType {
  cartItems: CartItem[];
  addToCart: (item: AddCartItemInput) => void;
  removeFromCart: (index: number) => void;
  updateItem: (index: number, newItem: CartItem) => void;
}

const defaultShoppingCartContext: ShoppingCartContextType = {
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateItem: () => {},
};

const ShoppingCartContext = createContext<ShoppingCartContextType>(
  defaultShoppingCartContext,
);

export default ShoppingCartContext;

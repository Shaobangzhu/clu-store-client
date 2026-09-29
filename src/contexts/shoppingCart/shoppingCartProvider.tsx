import ShoppingCartContext from "./shoppingCartContext";
import { useState } from "react";
import type { CartItem } from "@/types/custom";

interface ShoppingCartProviderProps {
  children: React.ReactNode;
}

const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.productId === item.productId,
      );

      if (existingItemIndex === -1) {
        return [...prevItems, item];
      }

      return prevItems.map((cartItem, index) =>
        index === existingItemIndex
          ? {
              ...cartItem,
              quantity: (cartItem.qty ?? 0) + 1,
            }
          : cartItem,
      );
    });
  };
  const removeFromCart = (index: number) => {
    setCartItems((prevItems) => [
      ...prevItems.slice(0, index),
      ...prevItems.slice(index + 1),
    ]);
  };

  return (
    <ShoppingCartContext.Provider
      value={{ cartItems, addToCart, removeFromCart }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;

import ShoppingCartContext from "./shoppingCartContext";
import { useState, useEffect } from "react";
import type { CartItem } from "@/types/custom";

interface ShoppingCartProviderProps {
  children: React.ReactNode;
}

const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // 从localStorage 中加载购物车数据, 如果没有则返回空数组
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cartItems]);

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
    setCartItems((prevItems) =>
      prevItems.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updateItem = (index: number, newItem: CartItem) => {
    setCartItems((prevItems) => {
      if (index < 0 || index >= prevItems.length) {
        console.error("Index out of bounds");
        return prevItems;
      }
      return [
        ...prevItems.slice(0, index),
        newItem,
        ...prevItems.slice(index + 1),
      ];
    });
  };

  return (
    <ShoppingCartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateItem }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;

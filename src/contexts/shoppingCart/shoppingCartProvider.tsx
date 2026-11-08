import ShoppingCartContext from "./shoppingCartContext";
import { useState, useEffect, useReducer } from "react";
import type { CartItem } from "@/types/custom";
import shoppingCartReducer from "../../reducers/shoppingCartReducer";
import usePersistedReducer from "@/hooks/usePersistedReducer";
import useShoppingCartAction from "@/hooks/useShoppingCartAction";

interface ShoppingCartProviderProps {
  children: React.ReactNode;
}

const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
  const [cartItems, dispatch] = usePersistedReducer(
    shoppingCartReducer,
    "shoppingCart",
    [],
  );

  const { addToCart, removeFromCart, updateItem, clearCart } =
    useShoppingCartAction(dispatch);

  return (
    <ShoppingCartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateItem, clearCart }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;

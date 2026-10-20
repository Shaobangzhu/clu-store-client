import { useReducer } from "react";
import ShoppingCartContext from "./shoppingCartContext";
import type { CartItem } from "@/types/custom";
import shoppingCartReducer from "../../reducers/shoppingCartReducer";

interface ShoppingCartProviderProps {
  children: React.ReactNode;
}

const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
  const [cartItems, dispatch] = useReducer(shoppingCartReducer, []);

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeFromCart = (index: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: index });
  };

  const updateItem = (index: number, newItem: CartItem) => {
    dispatch({ type: "UPDATE_ITEM", payload: { index, newItem } });
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

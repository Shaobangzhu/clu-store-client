import type { CartItem } from "../types/custom";
import type { Reducer } from "react";

// actions
type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_ITEM"; payload: { index: number; newItem: CartItem } }
  | { type: "CLEAR_CART" };

// reducer function
const shoppingCartReducer: Reducer<CartItem[], CartAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.findIndex(
        (item) => item.productId === action.payload.productId,
      );
      if (existingItemIndex !== -1) {
        return state.map((item, index) =>
          index === existingItemIndex
            ? { ...item, qty: (item.qty ?? 0) + 1 }
            : item,
        );
      }
      return [...state, action.payload];
    }
    case "REMOVE_ITEM":
      return state.filter((_, index) => index !== action.payload);
    case "UPDATE_ITEM":
      const { index, newItem } = action.payload;
      if (index < 0 || index >= state.length) {
        console.error("Index out of bounds");
        return state;
      }
      return [...state.slice(0, index), newItem, ...state.slice(index + 1)];
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export default shoppingCartReducer;

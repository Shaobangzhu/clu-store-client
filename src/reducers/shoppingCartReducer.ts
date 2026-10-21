import type { CartItem } from "../types/custom";
import type { Reducer } from "react";

export const addItem = (item: CartItem) => ({
  type: "ADD_ITEM" as const,
  payload: item,
});

export const removeItem = (index: number) => ({
  type: "REMOVE_ITEM" as const,
  payload: index,
});

export const updateItem = (index: number, newItem: CartItem) => ({
  type: "UPDATE_ITEM" as const,
  payload: { index, newItem },
});

export const clearCart = () => ({
  type: "CLEAR_CART" as const,
});

export type CartAction =
  | ReturnType<typeof addItem>
  | ReturnType<typeof removeItem>
  | ReturnType<typeof updateItem>
  | ReturnType<typeof clearCart>;

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

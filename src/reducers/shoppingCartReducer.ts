import type { CartDto } from '../api/services';

export interface CartState {
  cart: CartDto | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
}
export const initialCartState: CartState = { cart: null, status: 'idle', error: null };
export type CartAction =
  | { type: 'RESET' }
  | { type: 'START' }
  | { type: 'SYNC_CART'; payload: CartDto }
  | { type: 'FAIL'; error: string };

// Only a complete server snapshot can change lines, prices or totals.
export default function shoppingCartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'RESET': return initialCartState;
    case 'START': return { ...state, status: 'loading', error: null };
    case 'SYNC_CART': return { cart: action.payload, status: 'ready', error: null };
    case 'FAIL': return { ...state, status: 'error', error: action.error };
  }
}

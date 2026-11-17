import { useCallback, useEffect, useReducer, useRef } from 'react';
import shoppingCartReducer, { initialCartState } from '../reducers/shoppingCartReducer';
import { cartService, type CartDto } from '../api/services';
import { CART_LIMITS, cartError, sameSku, validQuantity } from '../api/cart';
import type { CartInput } from '../api/cart';
import type { RequestOptions } from '../helpers/api';

export default function useShoppingCartAction(token: string | null) {
  const [state, dispatch] = useReducer(shoppingCartReducer, initialCartState);
  const currentToken = useRef(token);
  currentToken.current = token;
  const epoch = useRef(0);
  const alive = useRef(false);
  const active = useRef<AbortController | null>(null);
  const confirmed = useRef<CartDto | null>(null);

  // One lock covers initial load, mutations AND reconciliation, including calls in the same tick.
  const run = useCallback(async (mutation?: (options: RequestOptions) => Promise<unknown>): Promise<boolean> => {
    if (!alive.current || currentToken.current !== token) return false;
    if (!token) { dispatch({ type: 'FAIL', error: 'cart.signIn' }); return false; }
    if (active.current) return false;
    const controller = new AbortController();
    const ownerEpoch = epoch.current;
    const isCurrent = () => alive.current && epoch.current === ownerEpoch
      && currentToken.current === token && !controller.signal.aborted;
    active.current = controller;
    confirmed.current = null;
    dispatch({ type: 'START' });
    let written = false;
    try {
      const options = { token, signal: controller.signal };
      if (mutation) { await mutation(options); written = true; }
      if (!isCurrent()) return false;
      const { data } = await cartService.get(options);
      if (!isCurrent()) return false;
      confirmed.current = data;
      dispatch({ type: 'SYNC_CART', payload: data });
      return true;
    } catch (failure) {
      if (isCurrent()) dispatch({ type: 'FAIL', error: written ? 'cart.reconcileFailed' : cartError(failure) });
      return false;
    } finally {
      if (active.current === controller) active.current = null;
    }
  }, [token]);

  useEffect(() => {
    alive.current = true;
    epoch.current += 1;
    dispatch({ type: 'RESET' });
    if (token) void run();
    return () => {
      alive.current = false;
      epoch.current += 1;
      active.current?.abort();
      active.current = null;
      confirmed.current = null;
    };
  }, [token, run]);

  const reject = (error: string): Promise<boolean> => {
    confirmed.current = null;
    dispatch({ type: 'FAIL', error });
    return Promise.resolve(false);
  };
  const mutate = (operation: (options: RequestOptions) => Promise<unknown>, validate?: (cart: CartDto) => string | null) => {
    if (!alive.current || currentToken.current !== token || active.current) return Promise.resolve(false);
    if (!token) return reject('cart.signIn');
    const cart = confirmed.current;
    if (!cart) return Promise.resolve(false);
    const error = validate?.(cart);
    if (error) return reject(error);
    return run(operation);
  };
  return {
    ...state,
    authenticated: !!token,
    busy: !!token && (state.status === 'idle' || state.status === 'loading'),
    ready: !!token && state.status === 'ready',
    cartItems: state.cart?.items ?? [],
    addToCart: (item: CartInput) => mutate(options => cartService.add({
      productId: item.productId, modelId: item.modelId, memorySizeId: item.memorySizeId,
      color: item.color, qty: item.qty,
    }, options), cart => {
      if (![item.productId, item.modelId, item.memorySizeId].every(id => Number.isSafeInteger(id) && id > 0)
        || !item.color.trim()) return 'cart.unavailableError';
      const existing = cart.items.find(line => sameSku(line, item));
      if (existing && !existing.available) return 'cart.unavailableError';
      if (!validQuantity(item.qty) || (existing?.qty ?? 0) + item.qty > CART_LIMITS.line
        || cart.totalQty + item.qty > CART_LIMITS.total
        || (!existing && cart.itemCount >= CART_LIMITS.configurations)) return 'cart.limit';
      return null;
    }),
    updateItem: (id: number, qty: number) => mutate(options => cartService.update(id, { qty }, options), cart => {
      const line = cart.items.find(item => item.id === id);
      if (!line) return 'cart.missing';
      if (!line.available) return 'cart.unavailableError';
      if (!validQuantity(qty) || cart.totalQty - line.qty + qty > CART_LIMITS.total) return 'cart.limit';
      return null;
    }),
    removeFromCart: (id: number) => mutate(options => cartService.remove(id, options),
      cart => cart.items.some(item => item.id === id) ? null : 'cart.missing'),
    clearCart: () => mutate(options => cartService.clear(options)),
    refreshCart: () => run(),
  };
}

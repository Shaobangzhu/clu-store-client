import { useRef, useState } from 'react';
import type { Dispatch } from 'react';
import { clearCart, addItem, removeItem, updateItem, syncCart } from '../reducers/shoppingCartReducer';
import type { CartAction } from '../reducers/shoppingCartReducer';
import type { CartItem } from '../types/custom';
import { cartService } from '../api/services';
import { positiveId, toCartItem } from '../api/adapters';

const useShoppingCartAction = (dispatch: Dispatch<CartAction>, items: CartItem[], token: string | null) => {
  const [error, setError] = useState<string | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const currentToken = useRef(token);
  currentToken.current = token;
  const run = (mutation: () => Promise<unknown>) => {
    const owner = token;
    queue.current = queue.current.then(async () => {
      if (currentToken.current !== owner) return;
      setError(null);
      await mutation();
      const result = await cartService.get({ token: owner });
      if (currentToken.current === owner) dispatch(syncCart(result.data.items.map(toCartItem)));
    }).catch(failure => {
      if (currentToken.current === owner) setError(failure instanceof Error ? failure.message : 'Cart request failed');
    });
    return queue.current;
  };
  return {
    error,
    addToCart: (item: CartItem) => {
      if (!token) { dispatch(addItem(item)); return; }
      return run(() => cartService.add({ productId: positiveId(item.productId), modelId: positiveId(item.modelId),
        memorySizeId: positiveId(item.memorySizeId), color: item.color ?? '', qty: item.qty }, { token }));
    },
    removeFromCart: (index: number) => {
      if (!token) { dispatch(removeItem(index)); return; }
      const id = items[index]?.id;
      return run(() => cartService.remove(positiveId(id ?? null), { token }));
    },
    updateItem: (index: number, item: CartItem) => {
      if (!token) { dispatch(updateItem(index, item)); return; }
      const id = items[index]?.id;
      return run(() => cartService.update(positiveId(id ?? null), { qty: item.qty }, { token }));
    },
    clearCart: () => {
      if (!token) { dispatch(clearCart()); return; }
      return run(() => cartService.clear({ token }));
    },
    refreshCart: () => token ? run(async () => {}) : Promise.resolve(),
    syncCart: (cartItems: CartItem[]) => dispatch(syncCart(cartItems)),
  };
};
export default useShoppingCartAction;

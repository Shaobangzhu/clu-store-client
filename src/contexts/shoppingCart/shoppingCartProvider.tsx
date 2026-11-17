import ShoppingCartContext from './shoppingCartContext';
import shoppingCartReducer, { syncCart } from '../../reducers/shoppingCartReducer';
import { useImmerReducer } from 'use-immer';
import useShoppingCartAction from '../../hooks/useShoppingCartAction';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { cartService } from '../../api/services';
import { toCartItem } from '../../api/adapters';

const ShoppingCartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, dispatch] = useImmerReducer(shoppingCartReducer, []);
  const { token } = useSelector((state: RootState) => state.user);
  const [loadError, setLoadError] = useState<string | null>(null);
  const previousToken = useRef(token);
  const actions = useShoppingCartAction(dispatch, cartItems, token);
  useEffect(() => {
    const controller = new AbortController();
    setLoadError(null);
    if (token || previousToken.current !== token) dispatch(syncCart([]));
    previousToken.current = token;
    if (token) {
      void cartService.get({ token, signal: controller.signal }).then(({ data }) => {
        if (!controller.signal.aborted) dispatch(syncCart(data.items.map(toCartItem)));
      }).catch(failure => {
        if (!controller.signal.aborted) setLoadError(failure instanceof Error ? failure.message : 'Cart request failed');
      });
    }
    return () => controller.abort();
  }, [token, dispatch]);
  return <ShoppingCartContext.Provider value={{ cartItems, ...actions }}>
    {(loadError || actions.error) && <p role="alert">{loadError || actions.error}</p>}
    {children}
  </ShoppingCartContext.Provider>;
};
export default ShoppingCartProvider;

import ShoppingCartContext from './shoppingCartContext';
import useShoppingCartAction from '../../hooks/useShoppingCartAction';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../redux/store';

const ShoppingCartProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, status, generation, user } = useSelector((state: RootState) => state.user);
  // Reset synchronously at the account boundary, even when mounted outside App's keyed subtree.
  return <AccountCart key={JSON.stringify([generation, user?.id, token, status])}
    token={status === 'authenticated' ? token : null}>{children}</AccountCart>;
};
function AccountCart({ token, children }: { token: string | null; children: React.ReactNode }) {
  const actions = useShoppingCartAction(token);
  const { t } = useTranslation();
  return <ShoppingCartContext.Provider value={actions}>
    {actions.error && <div role="alert" className="p-4">
      <p>{t(actions.error)}</p>
      {token && <button type="button" disabled={actions.busy} onClick={() => { void actions.refreshCart(); }}>
        {t('cart.reload')}
      </button>}
    </div>}
    {children}
  </ShoppingCartContext.Provider>;
}
export default ShoppingCartProvider;

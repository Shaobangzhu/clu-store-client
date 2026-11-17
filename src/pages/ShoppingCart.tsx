import { useContext } from 'react';
import ShoppingCartContext from '@/contexts/shoppingCart/shoppingCartContext';
import { Button, CartItem } from '@/components';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatMoney } from '@/api/catalog';
import { CART_LIMITS } from '@/api/cart';

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cart, cartItems, authenticated, busy, ready, error, updateItem, removeFromCart, clearCart, refreshCart } = useContext(ShoppingCartContext);
  const canCheckout = ready && cartItems.length > 0 && cartItems.every(item => item.available);
  return <div className="min-h-screen p-6 pt-30 max-w-4xl mx-auto bg-apple-light dark:bg-apple-dark font-light">
    <h1 className="text-4xl">{t('cart.title')}</h1>
    {!authenticated ? <Link to="/auth/signin" state={{ from: '/cart' }}>{t('cart.signIn')}</Link> : <>
      {busy && <p role="status">{t('cart.loading')}</p>}
      {error && cart && <p>{t('cart.lastConfirmed')}</p>}
      {ready && cartItems.length === 0 && <p>{t('cart.empty')}</p>}
      <div className="mb-6" aria-busy={busy}>
        {cartItems.map(item => <CartItem key={item.id} item={item} disabled={!ready}
          maxQuantity={CART_LIMITS.total - (cart?.totalQty ?? 0) + item.qty}
          onItemUpdate={qty => { void updateItem(item.id, qty); }}
          onItemRemove={() => { void removeFromCart(item.id); }} />)}
      </div>
      {cart && <p className="text-right text-2xl">{t('cart.total')}: {formatMoney(cart.totalAmount)}</p>}
      <div className="flex justify-end gap-4 mt-12">
        <Button title={t('cart.reload')} disabled={busy} onClick={() => { void refreshCart(); }} />
        <Button title={t('cart.clear')} disabled={!ready || cartItems.length === 0} onClick={() => { void clearCart(); }} />
        <Button title={t('cart.checkout')} disabled={!canCheckout} onClick={() => navigate('/checkout')} />
      </div>
    </>}
  </div>;
}

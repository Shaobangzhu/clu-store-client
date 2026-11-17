import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCartContext } from '../contexts/shoppingCart';
import type { CartInput } from '../api/cart';
import Button from './Button';

export default function AddToCartButton({ item }: { item: CartInput | null }) {
  const { addToCart, authenticated, ready, busy } = useContext(ShoppingCartContext);
  const location = useLocation();
  const { t } = useTranslation();
  if (!authenticated) return <Link to="/auth/signin" state={{ from: location.pathname + location.search + location.hash }}>{t('cart.signIn')}</Link>;
  return <Button title={t('home_page.product_hero.add_cart')} disabled={!item || !ready} loading={busy}
    onClick={() => { if (item) void addToCart(item); }} />;
}

import { useTranslation } from 'react-i18next';
import { FiTrash2 } from 'react-icons/fi';
import type { CartLine } from '../api/cart';
import { CART_LIMITS } from '../api/cart';
import { formatMoney } from '../api/catalog';
import ProductImage from './ProductImage';
import { mediaUrl } from '../helpers/api';

interface CartItemProps {
  item: CartLine;
  disabled: boolean;
  maxQuantity: number;
  onItemUpdate: (qty: number) => void;
  onItemRemove: () => void;
}
export default function CartItem({ item, disabled, maxQuantity, onItemUpdate, onItemRemove }: CartItemProps) {
  const { t } = useTranslation();
  const maximum = Math.min(CART_LIMITS.line, maxQuantity);
  const quantityDisabled = disabled || !item.available;
  return <>
    <div className="flex mt-6 p-0 w-full">
      <div className="w-1/3 flex items-center">
        <ProductImage src={mediaUrl(item.product.image)} alt={item.product.name} className="h-24 pl-4" />
      </div>
      <div className="w-2/3 flex flex-col justify-between">
        <p className="text-xl">{item.product.name}</p>
        <p className="text-sm">{item.color} | {item.memorySize.name} | {item.model.name}</p>
        <p>{t('cart.unitPrice')}: {formatMoney(item.unitPrice)}</p>
        <p>{t('cart.lineTotal')}: {formatMoney(item.lineTotal)}</p>
        {!item.available && <p role="status">{t('cart.unavailable')}</p>}
        <div className="flex gap-4 mt-4">
          <button type="button" aria-label={t('cart.decrease')} disabled={quantityDisabled || item.qty <= 1}
            onClick={() => onItemUpdate(item.qty - 1)}>−</button>
          <select aria-label={t('cart.quantity')} value={item.qty} disabled={quantityDisabled}
            onChange={event => onItemUpdate(Number(event.target.value))}>
            {item.qty > CART_LIMITS.line && <option value={item.qty} disabled>{item.qty}</option>}
            {Array.from({ length: CART_LIMITS.line }, (_, index) => index + 1).map(qty =>
              <option key={qty} value={qty} disabled={qty > maximum}>{qty}</option>)}
          </select>
          <button type="button" aria-label={t('cart.increase')} disabled={quantityDisabled || item.qty >= maximum}
            onClick={() => onItemUpdate(item.qty + 1)}>+</button>
          <button type="button" onClick={onItemRemove} disabled={disabled} aria-label={t('cart.remove')}>
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>
    </div>
    <hr className="mt-6 pt-2 border-t border-apple-gray-200 dark:border-apple-gray-800" />
  </>;
}

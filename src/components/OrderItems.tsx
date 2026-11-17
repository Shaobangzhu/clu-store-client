import { useTranslation } from 'react-i18next';
import { formatMoney } from '../api/catalog';
import type { OrderDto } from '../api/services';

type ReviewItem = Omit<OrderDto['items'][number], 'productId'> & { available?: boolean };
export default function OrderItems({ items }: { items: ReviewItem[] }) {
  const { t } = useTranslation();
  return <ul className="divide-y divide-apple-gray-200 dark:divide-apple-gray-800">
    {items.map(item => <li key={item.id} className="py-5 space-y-2">
      <h3 className="text-xl">{item.productName}</h3>
      <p>{item.modelName} · {item.memoryName} · {item.color}</p>
      {item.modelSpecification && <p>{item.modelSpecification}</p>}
      <p>{t('cart.quantity')}: {item.qty}</p>
      <p>{t('cart.unitPrice')}: {formatMoney(item.unitPrice)}</p>
      <p>{t('cart.lineTotal')}: {formatMoney(item.lineTotal)}</p>
      {item.available === false && <p role="status">{t('cart.unavailable')}</p>}
    </li>)}
  </ul>;
}

import { useTranslation } from 'react-i18next';
import { formatMoney } from '@/api/catalog';

export default function PriceTag({ modelAmount, sizeAmount, totalAmount }: {
  modelAmount?: string; sizeAmount?: string; totalAmount: string;
}) {
  const { t } = useTranslation();
  return <div className="mt-8 mr-4 text-b">
    <hr className="pb-4 border-apple-gray-200 dark:border-apple-gray-800" />
    <div className="grid grid-cols-2 gap-y-4 pl-12 pt-2">
      <span>{t('home_page.product_hero.model')}</span><span className="text-right">{modelAmount ? formatMoney(modelAmount) : '—'}</span>
      <span>+ {t('home_page.product_hero.memory')}</span><span className="text-right">{sizeAmount ? formatMoney(sizeAmount) : '—'}</span>
    </div>
    <hr className="mt-6 ml-24 border-t border-apple-gray-200 dark:border-apple-gray-800" />
    <div className="grid grid-cols-2 pl-12 pt-2 text-2xl" aria-live="polite">
      <span>{t('catalog.total')}</span><span className="text-right">{formatMoney(totalAmount)}</span>
    </div>
  </div>;
}

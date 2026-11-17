import type { Product } from '@/types/custom';
import Button from './Button';
import ProductImage from './ProductImage';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { canPurchase, formatMoney } from '@/api/catalog';

export default function SearchResultCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const available = canPurchase(product);
  const open = () => navigate(`/product-detail/${product.id}`);
  return <div className="bg-apple-gray-100 dark:bg-apple-gray-900 dark:border-apple-gray-500 rounded-2xl shadow-sm p-6 hover:transform hover:scale-105 transition-all duration-300">
    <div className="aspect-square object-contain rounded-xl">
      <ProductImage className="w-full h-full object-contain rounded-xl" src={product.image} alt={product.name} />
    </div>
    <h3 className="text-2xl font-semibold mt-2">{product.name}</h3>
    <p className="text-gray-400 mb-4">{product.title}</p>
    <div className="flex items-center justify-between gap-3">
      <span className="text-2xl font-medium">{formatMoney(product.startingPrice)}</span>
      <div className="flex gap-3">
        <Button title={t('catalog.chooseOptions')} disabled={!available} onClick={open} />
        <Button title={t('catalog.learnMore')} variant="outline" onClick={open} />
      </div>
    </div>
    {!available && <div className="mt-4 text-red-400">{t('catalog.unavailable')}</div>}
  </div>;
}

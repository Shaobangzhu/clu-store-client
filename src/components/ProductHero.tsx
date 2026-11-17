import SkuSelect from './SkuSelect';
import type { Product } from '@/types/custom';
import { useTranslation } from 'react-i18next';
import { canPurchase, formatMoney } from '@/api/catalog';
import useProductSelection from '@/hooks/useProductSelection';
import ProductImage from './ProductImage';
import AddToCartButton from './AddToCartButton';

export default function ProductHero({ product, imageUrl }: { product: Product; imageUrl?: string }) {
  const { t } = useTranslation();
  const selection = useProductSelection(product);
  return <div className="flex flex-col lg:flex-row-reverse pt-8 mt-4 md:pt-28 lg:pt-52 space-y-4 text-apple-text-light dark:text-apple-text-dark">
    <div className="flex-1 flex justify-center items-center">
      <ProductImage src={imageUrl || product.image} alt={product.name} className="w-[350px] lg:-mt-32 ml-19" />
    </div>
    <div className="flex-1 space-y-6 ml-6 md:ml-24">
      <div className="text-4xl font-black md:text-6xl">{t('catalog.buy', { name: product.name })}</div>
      <div className="font-medium md:text-xl" aria-live="polite">{formatMoney(selection.price)}</div>
      <div className="flex flex-wrap gap-3">
        <SkuSelect placeholder={t('home_page.product_hero.model')}
          options={product.models.map(model => ({ value: String(model.id), label: model.name, disabled: !model.inStock }))}
          value={selection.modelId === undefined ? '' : String(selection.modelId)}
          onChange={value => selection.select({ modelId: value ? Number(value) : undefined })} />
        <SkuSelect placeholder={t('home_page.product_hero.color')}
          options={product.colors.map(color => ({ value: color, label: color }))}
          value={selection.color} onChange={color => selection.select({ color: color || undefined })} />
        <SkuSelect placeholder={t('home_page.product_hero.memory')}
          options={product.memorySizes.map(size => ({ value: String(size.id), label: size.name, disabled: !size.inStock }))}
          value={selection.memorySizeId === undefined ? '' : String(selection.memorySizeId)}
          onChange={value => selection.select({ memorySizeId: value ? Number(value) : undefined })} />
        <AddToCartButton item={selection.cartItem} />
      </div>
      {!canPurchase(product) && <p>{t('catalog.unavailable')}</p>}
    </div>
  </div>;
}

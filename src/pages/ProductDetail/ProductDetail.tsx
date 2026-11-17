import { useLoaderData } from 'react-router-dom';
import type { Product } from '@/types/custom';
import { Button } from '@/components';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ProductTitle from './ProductTitle';
import ProductHero from './ProductHero';
import SelectTitle from './SelectTitle';
import SelectSquare from './SelectSquare';
import SelectCircle from './SelectCircle';
import PriceTag from './PriceTag';
import { ShoppingCartContext } from '@/contexts/shoppingCart';
import { canPurchase, formatMoney } from '@/api/catalog';
import useProductSelection from '@/hooks/useProductSelection';

export default function ProductDetail() {
  const product = useLoaderData<Product>();
  return <ProductConfiguration key={product.id} product={product} />;
}
function ProductConfiguration({ product }: { product: Product }) {
  const { addToCart } = useContext(ShoppingCartContext);
  const { t } = useTranslation();
  const selection = useProductSelection(product);
  const model = product.models.find(item => item.id === selection.modelId);
  const memory = product.memorySizes.find(item => item.id === selection.memorySizeId);
  return <div className="min-h-screen px-4 lg:px-32 mt-4 mb-40 text-apple-text-light dark:text-apple-text-dark">
    <ProductTitle name={product.name} startingPrice={product.startingPrice} installment={product.installments} />
    <p className="mt-4">{product.title}</p>
    {!canPurchase(product) && <p role="status" className="mt-4">{t('catalog.unavailable')}</p>}
    <div className="flex flex-col lg:flex-row gap-6 mt-12">
      <ProductHero imageSrc={product.carouselImages[0] || product.image} name={product.name} />
      <div className="flex flex-col items-center justify-center">
        <div className="w-full">
          <SelectTitle text1={t('home_page.product_hero.model')} text2={t('catalog.selectModel')} />
          <div className="mt-4 space-y-2">
            {product.models.map(item => <SelectSquare key={item.id} name={item.name} spec={item.specification}
              price={formatMoney(item.price)} disabled={!item.inStock}
              isSelected={selection.modelId === item.id} onClick={() => selection.select({ modelId: item.id })} />)}
          </div>
        </div>
        <div className="w-full mt-10">
          <SelectTitle text1={t('home_page.product_hero.color')} text2={t('catalog.selectColor')} />
          <div className="flex gap-4 mt-6 ml-6">
            {product.colors.map(color => <SelectCircle key={color} color={color}
              isSelected={selection.color === color} onClick={() => selection.select({ color })} />)}
          </div>
        </div>
        <div className="w-full mt-10">
          <SelectTitle text1={t('home_page.product_hero.memory')} text2={t('catalog.selectMemory')} />
          <div className="mt-4 space-y-2">
            {product.memorySizes.map(item => <SelectSquare key={item.id} name={item.name}
              price={`+ ${formatMoney(item.price)}`} disabled={!item.inStock}
              isSelected={selection.memorySizeId === item.id} onClick={() => selection.select({ memorySizeId: item.id })} />)}
          </div>
        </div>
      </div>
    </div>
    <PriceTag modelAmount={model?.price} sizeAmount={memory?.price} totalAmount={selection.price} />
    <div className="flex justify-end mt-12 mr-8">
      <Button title={t('home_page.product_hero.add_cart')} disabled={!selection.cartItem}
        onClick={() => { if (selection.cartItem) void addToCart(selection.cartItem); }} />
    </div>
  </div>;
}

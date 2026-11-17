import IconButton from './IconButton';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductImage from './ProductImage';
import type { Product } from '@/types/custom';
import { canPurchase } from '@/api/catalog';

export default function ImageHero({ product }: { product: Product }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const open = () => navigate(`/product-detail/${product.id}`);
  return <div className="relative bg-black text-white mb-2">
    <ProductImage src={product.image} alt={product.name} className="w-full h-[480px] object-contain block" />
    <div className="absolute inset-4 flex flex-col p-2 items-center justify-end text-center md:justify-start">
      <div className="text-4xl md:text-6xl font-bold">{product.name}</div>
      <div className="mt-4 flex space-x-4">
        <IconButton icon={<MdOutlineNavigateNext />} iconPosition="right"
          title={t('home_page.image_hero.learn_more')} variant="primary" onClick={open} />
        {canPurchase(product) && <IconButton icon={<AiOutlineShoppingCart />}
          title={t('home_page.image_hero.buy')} variant="outline" onClick={open} />}
      </div>
    </div>
  </div>;
}

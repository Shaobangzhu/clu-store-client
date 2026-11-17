import { Link } from 'react-router-dom';
import type { ProductInCategory } from '../types/custom';
import { useTranslation } from 'react-i18next';
import ProductImage from './ProductImage';
import CatalogStatus from './CatalogStatus';
import { formatMoney } from '@/api/catalog';

export default function CompareTable({ products }: { products: ProductInCategory[] }) {
  const { t } = useTranslation();
  return <>
    <h2 className="pt-10 pl-4 text-3xl md:text-6xl font-extrabold">{t('catalog.compare')}</h2>
    <CatalogStatus empty={products.length === 0} />
    <div className="pt-5 px-4 md:px-14 pb-10 flex gap-x-5 overflow-x-auto no-scrollbar">
      {products.map(product => <div key={product.id} className="w-96 flex-none flex flex-col items-center p-5 shadow-lg">
        <ProductImage src={product.image} alt={product.name} className="block mx-auto h-72" />
        <h3 className="mt-5 text-center text-xl font-semibold">{product.name}</h3>
        <p className="mt-2 text-center">{product.title}</p>
        <p className="mt-2 text-center text-lg font-semibold">
          {product.installments !== null && <>{t('catalog.installment', { price: formatMoney(product.installments) })} </>}
          {t('catalog.from', { price: formatMoney(product.startingPrice) })}
        </p>
        <div className="mt-6 flex justify-center items-center gap-2">
          <Link to={`/product-detail/${product.id}`} className="w-32 bg-blue-600 text-white py-2 px-4 rounded-md text-center">{t('catalog.learnMore')}</Link>
          {product.inStock && <Link to={`/product-detail/${product.id}`} className="text-blue-600">{t('catalog.chooseOptions')}</Link>}
        </div>
        {!product.inStock && <p>{t('catalog.unavailable')}</p>}
        <div className="mt-6 mb-6 border-t-2" />
        {product.features.map((feature, index) => <p key={index} className="mt-4 text-center text-sm">{feature}</p>)}
      </div>)}
    </div>
  </>;
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductList from '@/components/ProductList';
import NewArrival from '@/components/NewArrival';
import Offer from '@/components/Offer';
import ImageHero from '@/components/ImageHero';
import ProductHero from '@/components/ProductHero';
import CatalogStatus from '@/components/CatalogStatus';
import useApiData from '@/hooks/useApiData';
import { catalogService } from '@/api/services';
import { toProduct } from '@/api/adapters';
import { mediaUrl } from '@/helpers/api';

export default function Home() {
  const { t } = useTranslation();
  const featured = useApiData('home:featured', async signal => {
    const { data } = await catalogService.products({ page: '1', pageSize: '1', sort: 'newest' }, { signal });
    const first = data[0];
    // Purchase controls always use the detail response, never editorial/summary SKU data.
    return first ? toProduct((await catalogService.product(first.id, { signal })).data) : null;
  });
  const arrivals = useApiData('home:arrivals', async signal => (await catalogService.arrivals({ signal })).data);
  // The server owns active schedules; never substitute historical demo promotions.
  const offers = useApiData('home:offers', async signal => (await catalogService.offers({ signal })).data);
  return <div>
    <CatalogStatus loading={featured.loading} error={featured.error} empty={!featured.loading && !featured.error && !featured.data}
      retry={() => { void featured.fetchData().catch(() => {}); }} />
    {featured.data && <><ImageHero product={featured.data} /><ProductHero key={featured.data.id} product={featured.data} /></>}
    <CatalogStatus loading={arrivals.loading} error={arrivals.error} retry={() => { void arrivals.fetchData().catch(() => {}); }} />
    {arrivals.data && <ProductList title={t('home_page.newarrivals')} datalength={arrivals.data.length}>
      {arrivals.data.map(item => <div key={item.id} className={item.soldOut ? 'opacity-60' : ''}>
        {item.productId !== null ? <Link to={`/product-detail/${item.productId}`}>
          <NewArrival {...item} image={mediaUrl(item.image)} />
        </Link> : <NewArrival {...item} image={mediaUrl(item.image)} />}
        {item.soldOut && <p>{t('catalog.unavailable')}</p>}
      </div>)}
    </ProductList>}
    <CatalogStatus loading={offers.loading} error={offers.error} retry={() => { void offers.fetchData().catch(() => {}); }} />
    {offers.data && <ProductList title={t('home_page.offers')} datalength={offers.data.length}>
      {offers.data.map(item => <div key={item.id} className={item.soldOut ? 'opacity-60' : ''}>
        {item.productId !== null ? <Link to={`/product-detail/${item.productId}`}>
          <Offer {...item} image={mediaUrl(item.image)} />
        </Link> : <Offer {...item} image={mediaUrl(item.image)} />}
        {item.soldOut && <p>{t('catalog.unavailable')}</p>}
      </div>)}
    </ProductList>}
  </div>;
}

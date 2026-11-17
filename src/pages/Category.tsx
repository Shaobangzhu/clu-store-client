import { catalogService } from '@/api/services';
import { toCategory } from '@/api/adapters';
import { Link, useParams } from 'react-router-dom';
import { VideoHero, TextHeader, ImageSlider, CompareTable } from '@/components';
import useApiData from '@/hooks/useApiData';
import CatalogStatus from '@/components/CatalogStatus';
import { useTranslation } from 'react-i18next';

export default function Category() {
  const { category = '' } = useParams();
  const { t } = useTranslation();
  const { data, loading, error, fetchData } = useApiData(`category:${category}`,
    async signal => toCategory((await catalogService.category(category, { signal })).data));
  if (error || loading || !data) return <CatalogStatus loading={loading || !error} error={error}
    retry={() => { void fetchData().catch(() => {}); }} />;
  return <div className="min-h-screen">
    <TextHeader title={data.title} subTitle={data.subTitle} />
    <VideoHero key={data.slug} videoSrc={data.videos.regularSrc} videoSmallSrc={data.videos.smallSrc} />
    {data.features.length > 0 && <ImageSlider features={data.features} />}
    <CompareTable products={data.products} />
    <div className="p-8 text-center"><Link className="text-apple-blue"
      to={`/search?category=${encodeURIComponent(data.slug)}`}>{t('catalog.viewAll')}</Link></div>
  </div>;
}

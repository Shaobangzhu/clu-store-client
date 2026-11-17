import { useRouteError, useRevalidator, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@/helpers/api';
import CatalogStatus from '@/components/CatalogStatus';

export default function ProductError() {
  const error = useRouteError();
  const { revalidate, state } = useRevalidator();
  const { t } = useTranslation();
  return <div className="min-h-screen p-8 text-center">
    {error instanceof ApiError && error.status === 404
      ? <CatalogStatus empty />
      : <CatalogStatus loading={state === 'loading'} error={state === 'loading' ? null : 'failed'} retry={() => { void revalidate(); }} />}
    <Link className="text-apple-blue" to="/search">{t('catalog.viewAll')}</Link>
  </div>;
}

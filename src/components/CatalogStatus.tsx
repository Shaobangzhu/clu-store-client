import { useTranslation } from 'react-i18next';
import Button from './Button';

export default function CatalogStatus({ loading, error, empty, retry }: {
  loading?: boolean; error?: string | null; empty?: boolean; retry?: () => void;
}) {
  const { t } = useTranslation();
  if (error) return <div role="alert" className="p-8 text-center">
    <p>{t('catalog.failed')}</p>{retry && <Button title={t('catalog.retry')} onClick={retry} />}
  </div>;
  if (loading) return <p role="status" className="p-8 text-center">{t('catalog.loading')}</p>;
  return empty ? <p className="p-8 text-center">{t('catalog.empty')}</p> : null;
}

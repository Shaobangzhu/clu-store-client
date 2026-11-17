import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { catalogService } from '@/api/services';
import useApiData from '@/hooks/useApiData';
import { sanitizeSupportHtml } from '@/helpers/supportHtml';

export default function Support() {
  const { t } = useTranslation();
  const { data, loading, error, fetchData } = useApiData(
    'support', async signal => (await catalogService.support({ signal })).data,
  );
  const html = useMemo(() => sanitizeSupportHtml(data?.html ?? ''), [data]);
  const empty = !new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim();
  return <section className="min-h-screen p-4 text-apple-text dark:text-apple-text-dark" aria-label={t('routes.support')}>
    {loading ? <p role="status">{t('ui.loading')}</p> : error ? <div role="alert">
      <p>{t('support.failed')}</p>
      <button onClick={() => { void fetchData().catch(() => {}); }}>{t('catalog.retry')}</button>
    </div> : empty ? <p>{t('support.empty')}</p> : <div lang={data?.locale} className="text-sm" dangerouslySetInnerHTML={{ __html: html }} />}
  </section>;
}

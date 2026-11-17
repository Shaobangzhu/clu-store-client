import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState, StoreDispatch } from '../redux/store';
import { fetchSearchResults } from '@/redux/searchSlice';
import { catalogService } from '@/api/services';
import useApiData from '@/hooks/useApiData';
import { useDebounce } from '@/helpers/useDebounce';
import Button from '@/components/Button';
import SearchResultCard from '@/components/SearchResultCard';
import CatalogStatus from '@/components/CatalogStatus';

export default function SearchResults() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const query = params.get('query') ?? '';
  const category = params.get('category') ?? '';
  const rawPage = params.get('page') ?? '1';
  const page = /^[1-9]\d*$/.test(rawPage) && Number(rawPage) <= 10000 ? Number(rawPage) : 1;
  const debouncedQuery = useDebounce(query, 500);
  const [attempt, setAttempt] = useState(0);
  const { items, meta, isLoading, error } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch<StoreDispatch>();
  const categories = useApiData('categories', async signal => (await catalogService.categories({ signal })).data);
  const update = (values: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next);
  };
  useEffect(() => {
    if (query !== debouncedQuery) return;
    const request = dispatch(fetchSearchResults({ keyword: debouncedQuery || undefined,
      category: category || undefined, page: String(page), pageSize: '12' }));
    return () => request.abort();
  }, [query, debouncedQuery, category, page, dispatch, attempt]);
  const waiting = isLoading || query !== debouncedQuery;
  return <div className="flex min-h-screen w-full flex-col items-center px-4 py-8">
    <div className="w-full max-w-4xl mx-auto mb-12">
      <input type="search" aria-label={t('header.search')} value={query}
        onChange={event => update({ query: event.target.value, page: '1' })}
        placeholder={t('catalog.searchPlaceholder')}
        className="w-full px-6 py-4 bg-apple-white dark:bg-apple-dark rounded-xl text-lg border border-apple-gray dark:border-apple-dark-gray" />
      {!waiting && meta && <p className="mt-6">{t('catalog.results', { count: meta.total })}</p>}
    </div>
    <div className="max-w-4xl mx-auto mb-8 flex flex-wrap gap-4">
      <Button title={t('catalog.all')} variant={!category ? 'primary' : 'outline'} onClick={() => update({ category: '', page: '1' })} />
      {categories.data?.map(item => <Button key={item.id} title={item.title}
        variant={category === item.slug ? 'primary' : 'outline'}
        onClick={() => update({ category: item.slug, page: '1' })} />)}
    </div>
    <CatalogStatus error={categories.error} retry={() => { void categories.fetchData().catch(() => {}); }} />
    <CatalogStatus loading={waiting} error={waiting ? null : error} empty={!waiting && !error && items.length === 0}
      retry={() => setAttempt(value => value + 1)} />
    {!waiting && !error && <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {items.map(product => <SearchResultCard key={product.id} product={product} />)}
    </div>}
    <div className="flex items-center justify-center mt-8 gap-6">
      <Button title={t('catalog.previous')} disabled={waiting || !meta || meta.totalPages === 0 || page <= 1}
        onClick={() => update({ page: String(Math.min(page - 1, meta?.totalPages ?? 1)) })} />
      <p>{t('catalog.page', { page: meta?.totalPages === 0 ? 0 : meta?.page ?? page, total: meta?.totalPages ?? 0 })}</p>
      <Button title={t('catalog.next')} disabled={waiting || !meta || page >= meta.totalPages || page >= 10000}
        onClick={() => update({ page: String(page + 1) })} />
    </div>
  </div>;
}

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../redux/store';
import { orderService } from '../api/services';
import { formatMoney } from '../api/catalog';
import useApiData from '../hooks/useApiData';
import { orderError } from '../orders/errors';
import OrderItems from './OrderItems';
import Button from './Button';

export default function OrderList({ admin = false }: { admin?: boolean }) {
  const { token, user, generation, status } = useSelector((s: RootState) => s.user);
  const { t } = useTranslation();
  if (!token || status !== 'authenticated') return <p role="alert">{t('cart.signIn')}</p>;
  if (admin && user?.role !== 'ADMIN') return <p role="alert">{t('orders.forbidden')}</p>;
  return <Pages key={JSON.stringify([token, user?.id, user?.role, generation, admin])} token={token} admin={admin} />;
}
function Pages({ token, admin }: { token: string; admin: boolean }) {
  const [cursor, setCursor] = useState<string | undefined>();
  return <Page key={cursor ?? 'first'} token={token} admin={admin} cursor={cursor} navigate={setCursor} />;
}
function Page({ token, admin, cursor, navigate }: {
  token: string; admin: boolean; cursor?: string; navigate: (cursor: string | undefined) => void;
}) {
  const { t } = useTranslation();
  const { data, error, loading, fetchData } = useApiData('orders', async signal => {
    try {
      return await (admin ? orderService.adminList : orderService.list)(
        { pageSize: '20', sort: 'newest', ...(cursor ? { cursor } : {}) }, { token, signal });
    } catch (failure) { throw new Error(orderError(failure)); }
  });
  return <section className="max-w-4xl mx-auto p-6 space-y-6">
    <h1 className="text-3xl">{t(admin ? 'orders.admin' : 'orders.title')}</h1>
    <p>{t('checkout.demo')}</p>
    {loading && <p role="status">{t('order.loading')}</p>}
    {error && <p role="alert">{t(error)}</p>}
    {data?.data.length === 0 && <p>{t('orders.empty')}</p>}
    {data?.data.map(order => <article key={order.id} className="rounded-xl border border-apple-gray-200 p-5 space-y-3">
      <Link to={`/orders/${order.id}`} className="text-apple-blue underline">{t('order.id')} {order.id} — {t('orders.details')}</Link>
      <p>{t('order.status')}: {t(`order.${order.status}`)}</p>
      {admin && <p>{t('orders.owner')}: {order.userId}</p>}
      <p>{t('order.created')}: <time dateTime={order.createdAt}>{order.createdAt}</time></p>
      <p>{t('order.updated')}: <time dateTime={order.updatedAt}>{order.updatedAt}</time></p>
      <p>{t('cart.total')}: {formatMoney(order.totalAmount)} ({order.currency})</p>
      <OrderItems items={order.items} />
    </article>)}
    <div className="flex flex-wrap gap-4">
      <Button title={t('order.reload')} disabled={loading} onClick={() => { void fetchData().catch(() => {}); }} />
      {cursor && <Button title={t('orders.first')} disabled={loading} onClick={() => navigate(undefined)} />}
      {data?.meta.hasMore && data.meta.nextCursor && data.meta.nextCursor !== cursor &&
        <Button title={t('orders.next')} disabled={loading} onClick={() => navigate(data.meta.nextCursor!)} />}
    </div>
  </section>;
}

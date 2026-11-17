import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { orderService } from '../api/services';
import { formatMoney } from '../api/catalog';
import { validOrderId } from '../checkout/intent';
import { orderError } from '../orders/errors';
import AdminDecision from '../components/AdminDecision';
import useApiData from '../hooks/useApiData';
import OrderItems from '../components/OrderItems';
import Button from '../components/Button';
import { ShoppingCartContext } from '../contexts/shoppingCart';
import type { RootState } from '../redux/store';

export default function OrderDetail() {
  const { id } = useParams();
  const { token, user, generation } = useSelector((s: RootState) => s.user);
  // Prevent a previous order/account flashing during a route change.
  return <OrderReceipt key={JSON.stringify([id, token, user?.id, user?.role, generation])} id={id} token={token} admin={user?.role === 'ADMIN'} />;
}
function OrderReceipt({ id, token, admin }: { id: string | undefined; token: string | null; admin: boolean }) {
  const [decisionBusy, setDecisionBusy] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const { ready, busy, refreshCart } = useContext(ShoppingCartContext);
  const orderId = id && /^[1-9]\d*$/.test(id) ? Number(id) : 0;
  const valid = validOrderId(orderId);
  const { data, loading, error, fetchData } = useApiData(`order:${id}`, async signal => {
    try { return (await orderService.get(orderId, { token, signal })).data; }
    catch (failure) {
      throw new Error(orderError(failure));
    }
  }, { autoFetch: !!token && valid, scope: token });
  if (!token) return <p role="alert">{t('cart.signIn')}</p>;
  if (!valid) return <p role="alert">{t('order.notFound')}</p>;
  return <div className="min-h-screen p-6 pt-30 max-w-4xl mx-auto space-y-6">
    <h1 className="text-4xl">{t('order.title')}</h1>
    <p>{t('checkout.demo')}</p>
    {location.state?.cartRefreshFailed && !ready && <div role="alert">
      <p>{t('checkout.cartRefreshFailed')}</p>
      <Button title={t('cart.reload')} disabled={busy} onClick={() => { void refreshCart(); }} />
    </div>}
    {loading && <p role="status">{t('order.loading')}</p>}
    {error && <p role="alert">{t(error)}</p>}
    {data && <>
      {admin && <AdminDecision order={data} token={token} loading={loading} setBusy={setDecisionBusy}
        refresh={async () => { try { return await fetchData(); } finally { setDecisionBusy(false); } }} />}
      <dl className="space-y-2">
        <div><dt>{t('order.id')}</dt><dd>{data.id}</dd></div>
        <div><dt>{t('order.status')}</dt><dd>{t(`order.${data.status}`)}</dd></div>
        <div><dt>{t('order.created')}</dt><dd><time dateTime={data.createdAt}>{data.createdAt}</time></dd></div>
        <div><dt>{t('order.updated')}</dt><dd><time dateTime={data.updatedAt}>{data.updatedAt}</time></dd></div>
        <div><dt>{t('cart.total')}</dt><dd>{formatMoney(data.totalAmount)} ({data.currency})</dd></div>
      </dl>
      <section><h2 className="text-2xl">{t('order.items')}</h2><OrderItems items={data.items} /></section>
      <section className="space-y-3">
        <h2 className="text-2xl">{t('order.history')}</h2>
        {data.statusHistory.length === 0 && <p>{t('order.noHistory')}</p>}
        <ol className="space-y-4">{data.statusHistory.map(entry => <li key={entry.id}>
          <p>{entry.fromStatus ? t(`order.${entry.fromStatus}`) : t('order.createdStatus')} → {t(`order.${entry.toStatus}`)}</p>
          <time dateTime={entry.createdAt}>{entry.createdAt}</time>
          {entry.metadata?.note && <p>{entry.metadata.note}</p>}
        </li>)}</ol>
      </section>
    </>}
    <div className="flex flex-wrap gap-4 items-center">
      <Button title={t('order.reload')} disabled={loading || decisionBusy} onClick={() => { void fetchData().catch(() => {}); }} />
      <Link to="/user" className="text-apple-blue underline">{t('orders.title')}</Link>
      {admin && <Link to="/admin/orders" className="text-apple-blue underline">{t('orders.admin')}</Link>}
      <Link to="/cart" className="text-apple-blue underline">{t('checkout.reviewCart')}</Link>
    </div>
  </div>;
}

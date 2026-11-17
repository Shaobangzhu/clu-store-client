import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../redux/store';
import { orderService } from '../api/services';
import { formatMoney } from '../api/catalog';
import { ShoppingCartContext } from '../contexts/shoppingCart';
import { CHECKOUT_TIMEOUT_MS, finishIntent, placementFailure, readIntent, saveIntent, validCheckoutCart,
  validOrderId, type CheckoutIntent } from '../checkout/intent';
import Button from '../components/Button';
import OrderItems from '../components/OrderItems';

export default function CheckOut() {
  const { user, token, status, generation } = useSelector((s: RootState) => s.user);
  const { t } = useTranslation();
  if (!user || !token || status !== 'authenticated') return <p role="alert">{t('cart.signIn')}</p>;
  return <OrderReview key={JSON.stringify([user.id, token, generation])} userId={user.id} token={token} generation={generation} />;
}

function OrderReview({ userId, token, generation }: { userId: string; token: string; generation: number }) {
  const store = useStore<RootState>();
  const { cart, refreshCart, ready, busy, error: cartError } = useContext(ShoppingCartContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [initial] = useState(() => {
    try { return { intent: readIntent(userId), error: null }; }
    catch { return { intent: null, error: 'checkout.storage' }; }
  });
  const [intent, setIntent] = useState(initial.intent);
  const currentIntent = useRef(initial.intent);
  const [error, setError] = useState<string | null>(initial.error);
  const [loading, setLoading] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [storageBlocked, setStorageBlocked] = useState(!!initial.error);
  const active = useRef<AbortController | null>(null);
  const alive = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; active.current?.abort(); active.current = null; };
  }, []);

  const publish = (value: CheckoutIntent | null) => { currentIntent.current = value; setIntent(value); };
  const sameSession = () => {
    const session = store.getState().user;
    return session.token === token && session.user?.id === userId && session.generation === generation
      && session.status === 'authenticated' && !!session.expiresAt && session.expiresAt > Date.now();
  };
  const validCart = ready && !busy && validCheckoutCart(cart);
  // Replays precede cart checks on the backend. A lost success may have consumed the cart.
  const canSubmit = !storageBlocked && !loading && !busy
    && (intent?.state === 'unresolved' || ((!intent || (intent.state === 'review' && reviewed)) && validCart));

  const reloadCart = async () => {
    if (active.current) return;
    const refreshed = await refreshCart();
    if (alive.current && refreshed) setReviewed(true);
  };
  const handleSubmit = async () => {
    if (active.current || !sameSession() || !canSubmit || currentIntent.current?.state === 'confirmed') return;
    const controller = new AbortController();
    active.current = controller; // Synchronous lock covers placement AND cart reconciliation.
    setLoading(true);
    setError(null);
    const isCurrent = () => alive.current && sameSession() && active.current === controller && !controller.signal.aborted;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let pending: CheckoutIntent | null = null;
    try {
      try {
        // Reread before writing so a saved key is never accidentally replaced.
        const saved = readIntent(userId);
        if (saved?.state === 'confirmed' || saved?.state === 'conflict') { publish(saved); return; }
        const next: CheckoutIntent = { version: 1, userId,
          key: saved?.key ?? currentIntent.current?.key ?? crypto.randomUUID(), state: 'unresolved' };
        saveIntent(next); // Must succeed BEFORE the first POST.
        pending = next;
        publish(next);
      } catch {
        setStorageBlocked(true); setError('checkout.storage');
        return;
      }
      const result = await Promise.race([
        orderService.place({}, pending.key, { token, signal: controller.signal }),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => {
            reject(new Error('Checkout response timed out'));
            controller.abort();
          }, CHECKOUT_TIMEOUT_MS);
        }),
      ]);
      clearTimeout(timeout);
      if (!isCurrent()) return;
      if ((result.status !== 201 && result.status !== 200) || !result.data || !validOrderId(result.data.id)) {
        throw new Error('Invalid placement receipt');
      }
      const confirmed: CheckoutIntent = { ...pending, state: 'confirmed', orderId: result.data.id };
      publish(confirmed);
      // If this write fails, the durable unresolved key still replays the same order.
      try { saveIntent(confirmed); } catch { /* The receipt is confirmed in memory. */ }
      let refreshed = false;
      try { refreshed = await refreshCart(); } catch { /* Order success is independent of this GET. */ }
      if (isCurrent()) navigate(`/orders/${confirmed.orderId}`, { replace: true, state: { cartRefreshFailed: !refreshed } });
    } catch (failure) {
      // Aborting transport cannot undo an accepted server transaction.
      if (!pending || !alive.current || !sameSession() || active.current !== controller) return;
      const outcome = placementFailure(failure);
      const unresolved: CheckoutIntent = { ...pending, state: outcome.state };
      publish(unresolved);
      setReviewed(false);
      setError(outcome.message);
      try { saveIntent(unresolved); } catch { setStorageBlocked(true); setError('checkout.storage'); }
    } finally {
      clearTimeout(timeout);
      if (active.current === controller) { active.current = null; if (alive.current) setLoading(false); }
    }
  };

  const startNewPurchase = () => {
    if (active.current || currentIntent.current?.state !== 'confirmed' || !validCart) return;
    try { finishIntent(userId); publish(null); setError(null); setStorageBlocked(false); setReviewed(false); }
    catch { setStorageBlocked(true); setError('checkout.storage'); }
  };
  return <div className="min-h-screen p-6 pt-30 max-w-4xl mx-auto space-y-6">
    <h1 className="text-4xl">{t('checkout.title')}</h1>
    <p>{t('checkout.demo')}</p>
    <p>{t('checkout.authoritative')}</p>
    {busy && <p role="status">{t('cart.loading')}</p>}
    {cartError && <p role="alert">{t(cartError)}</p>}
    {error && <p role="alert">{t(error)}</p>}
    {intent?.state === 'unresolved' && !loading && <p role="status">{t('checkout.recovery')}</p>}
    {intent?.state === 'review' && !error && <p role="alert">{t('checkout.invalidRejected')}</p>}
    {intent?.state === 'conflict' && !error && <p role="alert">{t('checkout.conflict')}</p>}
    {intent?.state === 'confirmed' && <div className="space-y-3">
      <p role="status">{t('checkout.confirmed', { id: intent.orderId })}</p>
      <Link className="text-apple-blue underline" to={`/orders/${intent.orderId}`}>{t('checkout.viewOrder')}</Link>
      <Button title={t('checkout.newPurchase')} disabled={!validCart || loading} onClick={startNewPurchase} />
    </div>}
    {cart && <section aria-label={t('cart.title')}>
      {!ready && <p>{t('cart.lastConfirmed')}</p>}
      {ready && cart.items.length === 0 && <p>{t('cart.empty')}</p>}
      <OrderItems items={cart.items.map(item => ({ id: item.id, productName: item.product.name,
        modelName: item.model.name, modelSpecification: item.model.specification, memoryName: item.memorySize.name,
        color: item.color, qty: item.qty, unitPrice: item.unitPrice, lineTotal: item.lineTotal, available: item.available }))} />
      <p>{t('checkout.totalQuantity')}: {cart.totalQty}</p>
      <p className="text-2xl">{t('cart.total')}: {formatMoney(cart.totalAmount)} ({cart.currency})</p>
    </section>}
    {!intent && ready && cart && cart.items.length > 0 && !validCart && <p role="alert">{t('checkout.invalidCart')}</p>}
    <div className="flex flex-wrap gap-4 items-center">
      {!loading && <Link to="/cart" className="text-apple-blue underline">{t('checkout.reviewCart')}</Link>}
      <Button title={t('cart.reload')} disabled={busy || loading} onClick={() => { void reloadCart(); }} />
      {intent?.state !== 'confirmed' && <Button title={t(intent ? 'checkout.retry' : 'checkout.place')}
        onClick={() => { void handleSubmit(); }} loading={loading} disabled={!canSubmit} />}
    </div>
  </div>;
}

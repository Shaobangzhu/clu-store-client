import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { orderService, type OrderDto } from '../api/services';
import store from '../redux/store';
import { orderError } from '../orders/errors';
import Button from './Button';

export default function AdminDecision({ order, token, refresh, setBusy, loading }: {
  order: OrderDto; token: string; loading: boolean; refresh: () => Promise<unknown>; setBusy: (busy: boolean) => void;
}) {
  const { t } = useTranslation();
  const [note, setNote] = useState('');
  const [busy, localBusy] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState('');
  const active = useRef<AbortController | null>(null);
  const actionBlocked = useRef(false);
  const session = useRef(store.getState().user);
  useEffect(() => () => { active.current?.abort(); }, []);
  const validNote = note.trim().length <= 500 && !/[\u0000-\u001f\u007f]/.test(note);
  async function run(decision?: 'approve' | 'reject') {
    if (loading || active.current || store.getState().user !== session.current) return;
    if (decision && (actionBlocked.current || blocked || order.status !== 'pending' || !validNote)) return;
    const controller = new AbortController(); active.current = controller;
    const current = () => !controller.signal.aborted && store.getState().user === session.current;
    localBusy(true); setBusy(true); setMessage('');
    try {
      if (decision) {
        actionBlocked.current = true;
        await orderService[decision](order.id, note.trim() ? { metadata: { note: note.trim() } } : {},
          { token, signal: controller.signal });
        if (!current()) return;
        // Reconcile current state, including history, before another action is possible.
        setBlocked(true);
      }
      await refresh();
      if (current()) { if (!decision) actionBlocked.current = false; setBlocked(false); setNote(''); setMessage(decision ? 'orders.saved' : ''); }
    } catch (error) {
      if (current()) { setBlocked(true); setMessage(orderError(error)); }
    } finally {
      if (current()) { localBusy(false); setBusy(false); }
      if (active.current === controller) active.current = null;
    }
  }
  return <section className="space-y-3">
    <h2 className="text-2xl">{t('orders.admin')}</h2>
    {message && <p role="status">{t(message)}</p>}
    {blocked && <><p>{t('orders.reconcile')}</p>
      <Button title={t('orders.reconcileButton')} disabled={loading || busy} onClick={() => { void run(); }} /></>}
    {order.status === 'pending' && <>
      <label className="block">{t('orders.note')}
        <input className="block border rounded-lg p-3 w-full" value={note} maxLength={500} disabled={loading || busy || blocked}
          onChange={event => setNote(event.target.value)} />
      </label>
      {!validNote && <p role="alert">{t('orders.invalidNote')}</p>}
      <div className="flex gap-4">{(['approve', 'reject'] as const).map(decision =>
        <Button key={decision} title={t(`orders.${decision}`)} disabled={loading || busy || blocked || !validNote}
          onClick={() => { void run(decision); }} />)}</div>
    </>}
  </section>;
}

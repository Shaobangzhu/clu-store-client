import { useEffect, useRef, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { orderService } from '../api/services';
import { ShoppingCartContext } from '../contexts/shoppingCart';
import Button from '../components/Button';

function readIntent() {
  try { return sessionStorage.getItem('clu.checkout.intent'); } catch { return null; }
}
function writeIntent(value: string | null) {
  try {
    if (value) sessionStorage.setItem('clu.checkout.intent', value);
    else sessionStorage.removeItem('clu.checkout.intent');
  } catch { /* Memory-only intent when browser storage is unavailable. */ }
}
const CheckOut = () => {
  const { token } = useSelector((s: RootState) => s.user);
  const { cartItems, refreshCart, ready } = useContext(ShoppingCartContext);
  const navigate = useNavigate();
  const key = useRef<string | null>(readIntent());
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const submitting = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async () => {
    if (submitting.current || !token || !ready || cartItems.some(item => !item.available)) return;
    submitting.current = true;
    setLoading(true);
    setError(null);
    key.current ??= crypto.randomUUID();
    writeIntent(key.current);
    try {
      const { data } = await orderService.place({}, key.current, { token });
      if (!alive.current) return;
      // Checkout consumes selected persisted lines atomically. Do not DELETE the cart here.
      writeIntent(null);
      key.current = null;
      await refreshCart();
      if (!alive.current) return;
      navigate(`/orders/${data.id}`);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : '订单提交失败');
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };
  return <div className="min-h-screen pt-6 p-4">
    <h1 className="text-3xl">确认购物车订单</h1>
    <p>将提交服务器已保存的购物车。订单金额以服务器确认为准。</p>
    {!token && <p role="alert">请先登录</p>}
    {error && <p role="alert">{error}</p>}
    <Button title="下单" onClick={handleSubmit} loading={loading} disabled={!token || !ready || cartItems.some(item => !item.available) || (cartItems.length === 0 && !key.current)} />
  </div>;
};
export default CheckOut;

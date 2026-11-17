import { useRef, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { orderService } from '../api/services';
import { ShoppingCartContext } from '../contexts/shoppingCart';
import Button from '../components/Button';

const CheckOut = () => {
  const { token } = useSelector((s: RootState) => s.user);
  const { cartItems, refreshCart } = useContext(ShoppingCartContext);
  const navigate = useNavigate();
  const key = useRef<string | null>(sessionStorage.getItem('clu.checkout.intent'));
  const submitting = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async () => {
    if (submitting.current || !token) return;
    submitting.current = true;
    setLoading(true);
    setError(null);
    key.current ??= crypto.randomUUID();
    sessionStorage.setItem('clu.checkout.intent', key.current);
    try {
      const { data } = await orderService.place({}, key.current, { token });
      // Checkout consumes selected persisted lines atomically. Do not DELETE the cart here.
      sessionStorage.removeItem('clu.checkout.intent');
      key.current = null;
      await refreshCart();
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
    <Button title="下单" onClick={handleSubmit} loading={loading} disabled={!token || (cartItems.length === 0 && !key.current)} />
  </div>;
};
export default CheckOut;

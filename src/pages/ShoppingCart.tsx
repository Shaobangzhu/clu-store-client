import { useContext, useEffect, useState } from "react";
import ShoppingCartContext from "@/contexts/shoppingCart/shoppingCartContext";
import { Button } from "@/components";

const shoppingCart = () => {
  const { cartItems } = useContext(ShoppingCartContext);

  const [total, setTotal] = useState(0);
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) =>
        acc +
        ((item.modelPrice ?? 0) + (item.memorySizePrice ?? 0)) *
          (item.qty ?? 0),
      0,
    );
    setTotal(total);
  }, [cartItems]);

  const shippingFee = 150; // 假设运费为hard coded ¥150, 实际应用中可以根据条件计算

  return (
    <div className="min-h-screen p-6 pt-30">
      <h2>购物车总价 ¥{(total + shippingFee).toLocaleString()}</h2>
      {/* 商品列表 */}
      <div className="mb-6">{/* todo */}</div>
      {/* 结算区域 */}
      <div>
        <div>
          <p>小计: RMB {total.toLocaleString()}</p>
          <p>运费: RMB {shippingFee.toLocaleString()}</p>
        </div>
        <hr />
        <div>
          <p>总计: RMB {(total + shippingFee).toLocaleString()}</p>
          <Button title="结账"></Button>
        </div>
      </div>
    </div>
  );
};

export default shoppingCart;

import { useContext } from "react";
import ShoppingCartContext from "@/contexts/shoppingCart/shoppingCartContext";

const shoppingCart = () => {
  const { cartItems } = useContext(ShoppingCartContext);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">购物车</h1>
      <p className="text-gray-600">{JSON.stringify(cartItems)}</p>
    </div>
  );
};

export default shoppingCart;

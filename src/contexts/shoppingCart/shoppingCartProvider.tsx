import ShoppingCartContext from "./shoppingCartContext";
import shoppingCartReducer from "../../reducers/shoppingCartReducer";
import usePersistedReducer from "@/hooks/usePersistedReducer";
import useShoppingCartAction from "@/hooks/useShoppingCartAction";

interface ShoppingCartProviderProps {
  children: React.ReactNode;
}

const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
  const [cartItems, dispatch] = usePersistedReducer(
    shoppingCartReducer,
    "shoppingCart",
    [],
  );

  const { addToCart, removeFromCart, updateItem, clearCart } =
    useShoppingCartAction(dispatch);

  return (
    <ShoppingCartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateItem }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;

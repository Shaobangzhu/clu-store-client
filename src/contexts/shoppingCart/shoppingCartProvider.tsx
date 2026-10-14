import ShoppingCartContext from "./shoppingCartContext";
import type { CartItem, AddCartItemInput } from "@/types/custom";
import useLocalStorage from "@/hooks/useLocalStorage";

interface ShoppingCartProviderProps {
  children: React.ReactNode;
}

const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("cart", []);

  const addToCart = (item: AddCartItemInput) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.modelId === item.modelId &&
          cartItem.color === item.color &&
          cartItem.memorySizeId === item.memorySizeId,
      );

      if (existingItemIndex === -1) {
        const newItem: CartItem = {
          ...item,
          id: Math.max(0, ...prevItems.map((x) => x.id)) + 1,
        };

        return [...prevItems, newItem];
      }

      return prevItems.map((cartItem, index) =>
        index === existingItemIndex
          ? {
              ...cartItem,
              qty: (cartItem.qty ?? 0) + (item.qty ?? 1),
            }
          : cartItem,
      );
    });
  };
  const removeFromCart = (index: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updateItem = (index: number, newItem: CartItem) => {
    setCartItems((prevItems) => {
      if (index < 0 || index >= prevItems.length) {
        console.error("Index out of bounds");
        return prevItems;
      }
      return [
        ...prevItems.slice(0, index),
        newItem,
        ...prevItems.slice(index + 1),
      ];
    });
  };

  return (
    <ShoppingCartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateItem }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;

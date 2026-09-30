import { ShoppingCartProvider } from "./contexts/shoppingCart";
import router from "./routes";
import { RouterProvider } from "react-router-dom";

function App() {
  // 单根节点原则
  return (
    <ShoppingCartProvider>
      <RouterProvider router={router} />
    </ShoppingCartProvider>
  );
}

export default App;

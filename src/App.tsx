import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import { ShoppingCartProvider } from "./contexts/shoppingCart";
import router from "./routes";
import { RouterProvider } from "react-router-dom";
import AppInit from "./AppInit";

function App() {
  const generation = useSelector((state: RootState) => state.user.generation);
  return (
    <>
      <AppInit />
      <ShoppingCartProvider key={generation}>
        <RouterProvider router={router} />
      </ShoppingCartProvider>
    </>
  );
}

export default App;

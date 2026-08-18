import router from "./routes";
import { RouterProvider } from "react-router-dom";

function App() {
  // 单根节点原则
  return <RouterProvider router={router} />;
}

export default App;

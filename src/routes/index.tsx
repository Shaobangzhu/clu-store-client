import { createBrowserRouter } from "react-router-dom";
import { Header, Footer } from "@/components";
import MainLayout from "@/layouts/MainLayout";
import BlankLayout from "@/layouts/BlankLayout";
import {
  Home,
  About,
  Phones,
  IPad,
  Computers,
  SmartHome,
  Entertainment,
  Support,
  SignIn,
  Register,
} from "../pages";

const router = createBrowserRouter([
  // 根目录 "/"
  {
    path: "/",
    element: <MainLayout header={<Header />} footer={<Footer />} />,
    children: [
      {
        index: true, // 默认子路由
        element: <Home />,
      },
      { path: "about", element: <About /> },
      { path: "phones", element: <Phones /> },
      { path: "ipad", element: <IPad /> },
      { path: "computers", element: <Computers /> },
      { path: "smarthome", element: <SmartHome /> },
      { path: "entertainment", element: <Entertainment /> },
      { path: "support", element: <Support /> },
    ],
  },
  // 用户权限目录"/auth""
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "signin", element: <SignIn /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export default router;

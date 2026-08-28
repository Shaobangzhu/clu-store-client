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
  ErrorPage,
  NotFound,
  ProductDetail,
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
        errorElement: <ErrorPage />,
      },
      { path: "about", element: <About />, errorElement: <ErrorPage /> },
      { path: "phones", element: <Phones />, errorElement: <ErrorPage /> },
      { path: "ipad", element: <IPad />, errorElement: <ErrorPage /> },
      {
        path: "computers",
        element: <Computers />,
        errorElement: <ErrorPage />,
      },
      {
        path: "smarthome",
        element: <SmartHome />,
        errorElement: <ErrorPage />,
      },
      {
        path: "entertainment",
        element: <Entertainment />,
        errorElement: <ErrorPage />,
      },
      { path: "support", element: <Support />, errorElement: <ErrorPage /> },
      {
        path: "product-detail/:id",
        element: <ProductDetail />,
        errorElement: <ErrorPage />,
      },
      { path: "*", element: <NotFound /> },
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

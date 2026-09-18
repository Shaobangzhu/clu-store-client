import { createBrowserRouter, type LoaderFunctionArgs } from "react-router-dom";
import { Header, Footer } from "@/components";
import MainLayout from "@/layouts/MainLayout";
import BlankLayout from "@/layouts/BlankLayout";
import UserLayout from "@/layouts/UserLayout";
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
  SearchResults,
  UserCenter,
} from "../pages";
import RequireAuth from "@/HOCs/RequireAuth";
import { loadProducts } from "@/helpers/loaders";

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
        loader: async ({ params, request }: LoaderFunctionArgs) => {
          const productId = params.id;
          if (!productId) {
            throw new Response("未提供产品ID", {
              status: 400,
              statusText: "Bad Request",
            });
          }
          return await loadProducts(productId, request.signal);
        },
      },
      {
        path: "search",
        element: <SearchResults />,
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
  {
    path: "/user",
    element: (
      <RequireAuth>
        <UserLayout />
      </RequireAuth>
    ),
    children: [{ path: "", element: <UserCenter /> }],
  },
]);

export default router;

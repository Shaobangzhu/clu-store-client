import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import Skeleton from '../components/Skeleton';
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation();
  const { token, status, expiresAt } = useSelector((state: RootState) => state.user);
  if (status === "uninitialized" || status === "initializing") return <Skeleton />;
  if (!token || status !== "authenticated" || !expiresAt || expiresAt <= Date.now()) {
    // 如果没有token, 重定向到登录页面，并携带当前路径作为"来源页"
    return (
      <Navigate to="/auth/signin" state={{ from: location.pathname + location.search + location.hash }} replace />
    );
  }
  // 如果有 token, 渲染自组件
  return children;
};

export default RequireAuth;

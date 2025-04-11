// src/app/routes.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { FC } from "react";

export const ProtectedRoute: FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isTestMode = useAuthStore((state) => state.isTestMode);

  if (!isAuthenticated && !isTestMode) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const LogoutRoute: FC = () => {
  const { logout } = useAuthStore();
  logout();
  return <Navigate to="/login" replace />;
};

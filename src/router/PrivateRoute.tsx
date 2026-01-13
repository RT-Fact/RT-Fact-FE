import { Navigate, Outlet, useLocation } from "react-router";

import { useAuthStore } from "@/stores/authStore";

export const PrivateRoute = () => {
  const { accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

import { Navigate, Outlet, useLocation } from "react-router";

import { useAuthStore } from "@/stores/authStore";

export const PrivateRoute = () => {
  const isGuest = useAuthStore((state) => state.isGuest);
  const location = useLocation();

  if (isGuest) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

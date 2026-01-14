import { createBrowserRouter } from "react-router";

import { MainLayout } from "@/layouts/MainLayout";
import { AuthCallbackPage, HomePage, LoginPage, SettingsPage } from "@/pages";

import { PrivateRoute } from "./PrivateRoute";

export const router = createBrowserRouter([
  // OAuth 콜백은 MainLayout 바깥에서 처리 (세션 초기화 충돌 방지)
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
]);

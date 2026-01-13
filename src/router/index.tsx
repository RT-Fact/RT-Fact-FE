import { createBrowserRouter } from "react-router";

import { MainLayout } from "@/layouts/MainLayout";
import { HomePage, LoginPage, SettingsPage } from "@/pages";
import { AuthCallbackPage } from "@/pages/AuthCallbackPage";

import { PrivateRoute } from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/auth/callback",
        element: <AuthCallbackPage />,
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

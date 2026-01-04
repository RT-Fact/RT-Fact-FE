import { createBrowserRouter } from "react-router";

import { MainLayout } from "@/layouts/MainLayout";
import { HomePage, LoginPage, SettingsPage } from "@/pages";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

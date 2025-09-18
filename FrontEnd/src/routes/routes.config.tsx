import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";

import { publicRoutes } from "./public.routes";
import { privateRoutes } from "./private.routes";
import { adminRoutes } from "./admin.routes";
import LoginPage from "../pages/Login";

export const routesConfig = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      ...publicRoutes,
      {
        element: <ProtectedRoute />, // yêu cầu đăng nhập
        children: [
          ...privateRoutes,
          {
            element: <RoleBasedRoute roles={["admin"]} />, // yêu cầu role admin
            children: adminRoutes,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <div>RegisterPage</div> },
    ],
  },
];

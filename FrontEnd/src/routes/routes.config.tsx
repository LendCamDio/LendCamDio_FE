import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";

import { publicRoutes } from "./public.routes";
import { privateRoutes } from "./private.routes";
import { adminRoutes } from "./admin.routes";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import ForgotPasswordPage from "@/pages/Forgot-password";
import ErrorPage from "@/pages/Error";

export const routesConfig = [
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...publicRoutes,
      {
        element: <ProtectedRoute />, // yêu cầu đăng nhập
        children: [
          ...privateRoutes,
          {
            path: "/admin",
            element: <RoleBasedRoute allowedRoles={["Admin"]} />, // yêu cầu role Admin
            children: adminRoutes,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
    ],
  },
];

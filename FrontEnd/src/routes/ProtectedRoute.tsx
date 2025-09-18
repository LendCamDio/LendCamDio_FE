import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
  const { user } = useAuth(); // user = null nếu chưa login
  if (!user) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
}

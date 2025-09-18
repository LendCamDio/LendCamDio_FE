import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  roles: string[];
}

export function RoleBasedRoute({ roles }: Props) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" replace />;

  // Tmp role is "user"
  const userRole = "user";
  if (!roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";
import { useUniqueToast } from "@/hooks/useUniqueToast";

export function ProtectedRoute() {
  const { token, isLoading } = useAuth();
  const location = useLocation();
  const showToast = useUniqueToast();

  if (isLoading) {
    showToast("Đang kiểm tra phiên đăng nhập...", "info");
    return null;
  }

  if (!token) {
    showToast("Vui lòng đăng nhập để tiếp tục", "error", undefined, 1000);
    return (
      <>
        <Navigate to="/auth/login" state={{ from: location }} replace />
      </>
    );
  }

  return <Outlet />;
}

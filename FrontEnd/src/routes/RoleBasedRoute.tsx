import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";

interface Props {
  allowedRoles: string[];
}

export function RoleBasedRoute({ allowedRoles }: Props) {
  const { token, isLoading, role } = useAuth();
  const location = useLocation();
  const showToast = useUniqueToast();

  if (isLoading) {
    return <div>Loading...</div>; // Hoặc một spinner/loading component
  }

  if (!token) {
    // Lưu trạng thái / đường dẫn hiện tại để chuyển hướng sau khi đăng nhập
    showToast("Vui lòng đăng nhập để tiếp tục", "error", { duration: 1000 });
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Kiểm tra role có trong allowedRoles không
  const flag: boolean = role
    ? allowedRoles.some((r) => r.toLowerCase() === role.toLowerCase())
    : false;

  if (!flag) {
    showToast("Bạn không có quyền truy cập trang này", "info", {
      duration: 1000,
    });
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

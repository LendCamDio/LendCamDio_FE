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
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    // Lưu trạng thái / đường dẫn hiện tại để chuyển hướng sau khi đăng nhập
    showToast("Vui lòng đăng nhập để tiếp tục", "error", { duration: 1000 });
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Admin có quyền truy cập TẤT CẢ các trang
  const isAdmin = role?.toLowerCase() === "admin";

  // Kiểm tra role có trong allowedRoles không (so sánh không phân biệt chữ hoa/thường)
  // Admin luôn được phép truy cập
  const hasAccess: boolean =
    isAdmin ||
    (role
      ? allowedRoles.some((r) => r.toLowerCase() === role.toLowerCase())
      : false);



  if (!hasAccess) {
    showToast("Bạn không có quyền truy cập trang này", "error", {
      duration: 2000,
    });
    // Redirect về trang chủ thay vì trang trước đó
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

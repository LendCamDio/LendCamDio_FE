// src/layouts/AdminLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  ShoppingCart,
  BarChart3,
  LogOut,
  Menu,
  X,
  Package,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion"; // Sử dụng framer-motion cho animation mượt mà
import { useAuth } from "@/hooks/auth/useAuth";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";

// Menu items cho sidebar (có thể mở rộng)
const menuItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Package, label: "Equipment", path: "/admin/equipments" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: ShoppingCart, label: "Rentals", path: "/admin/rentals" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
];

export default function AdminLayout() {
  const { logout, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const showToast = useUniqueToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Kiểm tra quyền truy cập admin
  useEffect(() => {
    if (!isLoading && role?.toLowerCase() !== "admin") {
      showToast("Bạn không có quyền truy cập trang quản trị", "error");
      navigate("/", { replace: true });
    }
  }, [role, isLoading, navigate, showToast]);

  // Hiển thị loading trong khi kiểm tra quyền
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Chỉ render nếu là admin
  if (role?.toLowerCase() !== "admin") {
    return null;
  }

  // Animation variants cho sidebar collapse
  const sidebarVariants = {
    expanded: { width: "16rem" }, // w-64
    collapsed: { width: "5rem" }, // w-20
  };

  return (
    <div className="flex h-screen bg-[var(--bg-light)] overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="expanded"
        animate={sidebarCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white shadow-xl flex flex-col h-full relative z-10 border-r border-gray-200"
      >
        {/* Logo/Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
              Admin Panel
            </h2>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-[var(--text-dark)] hover:text-[var(--PRIMARY-color)] transition-colors p-1"
          >
            {sidebarCollapsed ? (
              <Menu size={24} className="ml-2" />
            ) : (
              <X size={24} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <motion.li
                key={item.path}
                whileHover={{
                  y: -1,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                }}
                className="rounded-lg overflow-hidden"
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 transition-all duration-200 rounded-lg ${
                    location.pathname.startsWith(item.path)
                      ? "bg-[var(--primary-color)] text-white shadow-glow"
                      : "text-[var(--text-dark)] hover:bg-[rgba(59,130,246,0.1)] hover:text-[var(--primary-color)]"
                  }`}
                >
                  <item.icon size={20} />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Footer Sidebar (Logout & Notifications) */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 p-3 rounded-lg text-[var(--text-dark)] hover:bg-[rgba(239,68,68,0.1)] hover:text-red-600 transition-all w-full"
          >
            <LogOut size={20} />
            {!sidebarCollapsed && (
              <span className="font-medium">Đăng xuất</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-md border-b border-gray-200 px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-[var(--text-dark)]">
              {menuItems.find((item) => location.pathname.startsWith(item.path))
                ?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] flex items-center justify-center text-white font-bold">
                A
              </div>
              {!sidebarCollapsed && ( // Ẩn tên user nếu sidebar collapsed, nhưng navbar độc lập
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--text-dark)]">
                    Admin User
                  </p>
                  <p className="text-xs text-[var(--text-light)]">
                    admin@example.com
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content (Outlet) */}
        <main className="flex-1 p-6 overflow-y-auto bg-[var(--bg-light)] animate-fade-in-up">
          <Outlet />
        </main>

        {/* Footer (Optional) */}
        <footer className="bg-white border-t border-gray-200 px-6 py-3 text-center text-sm text-[var(--text-light)]">
          © 2025 Admin Dashboard. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

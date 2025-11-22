import { lazy } from "react";

// Lazy load admin pages
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const EquipmentManagement = lazy(
  () => import("@/pages/admin/equipments/EquipmentManagement")
);
const UserManagement = lazy(() => import("@/pages/admin/UserManagement"));
const RentalManagement = lazy(() => import("@/pages/admin/RentalManagement"));
const Analytics = lazy(() => import("@/pages/admin/Analytics"));
const OrderManagement = lazy(() => import("@/pages/admin/OrderManagement"));
const AdManagement = lazy(() => import("@/pages/admin/AdManagement"));

export const adminRoutes = [
  {
    path: "",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "equipments",
        element: <EquipmentManagement />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "orders",
        element: <OrderManagement />,
      },
      {
        path: "rentals",
        element: <RentalManagement />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "ads",
        element: <AdManagement />,
      },
    ],
    ErrorElement: <div>AdminLayoutError</div>,
  },
];

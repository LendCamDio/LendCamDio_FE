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
        path: "rentals",
        element: <RentalManagement />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
    ErrorElement: <div>AdminLayoutError</div>,
  },
];

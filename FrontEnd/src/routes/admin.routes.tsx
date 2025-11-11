import { lazy } from "react";
import AdminLayout from "@/layouts/AdminLayout";

// Lazy load admin pages
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const EquipmentManagement = lazy(
  () => import("@/pages/admin/EquipmentManagement")
);
const UserManagement = lazy(() => import("@/pages/admin/UserManagement"));
const RentalManagement = lazy(() => import("@/pages/admin/RentalManagement"));

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
    ],
    ErrorElement: <div>AdminLayoutError</div>,
  },
];

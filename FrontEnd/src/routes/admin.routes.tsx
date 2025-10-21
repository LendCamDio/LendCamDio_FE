import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";

export const adminRoutes = [
  {
    path: "",
    element: <AdminLayout />,
    children: [
      { index: true, path: "dashboard", element: <Dashboard /> },
      { path: "users", element: <div>AdminUserManagement</div> },
    ],
    ErrorElement: <div>AdminLayoutError</div>,
  },
];

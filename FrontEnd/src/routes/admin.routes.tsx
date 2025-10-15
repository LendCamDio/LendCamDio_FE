import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";

export const adminRoutes = [
  {
    path: "",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <div>AdminUserManagement</div> },
    ],
  },
];

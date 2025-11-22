import { lazy } from "react";

// Lazy load supplier pages
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
const FeedbackManagement = lazy(() => import("@/pages/supplier/FeedbackManagement"));
const RentalManagement = lazy(() => import("@/pages/supplier/RentalManagement"));
const ProfileManagement = lazy(() => import("@/pages/supplier/ProfileManagement"));
const IdentityVerification = lazy(() => import("@/pages/customer/IdentityVerification"));
const SupplierAdPackages = lazy(() => import("@/pages/supplier/AdPackages"));
const SupplierMyCampaigns = lazy(() => import("@/pages/supplier/MyCampaigns"));
// Reusing EquipmentManagement, assuming it will be adapted for supplier view
const EquipmentManagement = lazy(() => import("@/pages/admin/equipments/EquipmentManagement"));

export const supplierRoutes = [
  {
    path: "",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <EquipmentManagement />,
      },
      {
        path: "equipments",
        element: <EquipmentManagement />,
      },
      {
        path: "rentals",
        element: <RentalManagement />,
      },
      {
        path: "feedbacks",
        element: <FeedbackManagement />,
      },
      {
        path: "profile",
        element: <ProfileManagement />,
      },
      {
        path: "identity-verification",
        element: <IdentityVerification />,
      },
      {
        path: "ad-packages",
        element: <SupplierAdPackages />,
      },
      {
        path: "my-campaigns",
        element: <SupplierMyCampaigns />,
      },
    ],
    ErrorElement: <div>SupplierLayoutError</div>,
  },
];

import { Navigate } from "react-router-dom";
import { RoleBasedRoute } from "./RoleBasedRoute";
import Cart from "@/pages/customer/Cart";

export const privateRoutes = [
  {
    path: "/customers",
    element: <RoleBasedRoute allowedRoles={["Customer"]} />,
    children: [
      {
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          {
            path: "/customers/booking-history",
            element: <div>OrderHistory</div>,
          },
          { path: "/customers/cart", element: <Cart /> },
        ],
      },
    ],
  },
  {
    path: "/suppliers",
    element: <RoleBasedRoute allowedRoles={["Supplier"]} />,
    children: [
      {
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: "profile", element: <div>SupplierProfile</div> },
        ],
      },
    ],
  },
];

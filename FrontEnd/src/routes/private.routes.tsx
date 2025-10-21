import { Navigate } from "react-router-dom";
import { RoleBasedRoute } from "./RoleBasedRoute";
import Cart from "@/pages/customer/Cart";
import Profile from "@/pages/customer/Profile";
import MyBooking from "@/pages/customer/MyBooking";

export const privateRoutes = [
  {
    path: "/customer",
    element: <RoleBasedRoute allowedRoles={["Customer"]} />,
    children: [
      {
        children: [
          {
            index: true,
            path: "profile",
            element: <Profile />,
          },
          {
            path: "booking-history",
            element: <MyBooking />,
          },
          { path: "cart", element: <Cart /> },
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

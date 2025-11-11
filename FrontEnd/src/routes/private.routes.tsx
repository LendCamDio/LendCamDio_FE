import { Navigate } from "react-router-dom";
import { RoleBasedRoute } from "./RoleBasedRoute";
import { lazy } from "react";

// Lazy load customer pages
const Dashboard = lazy(() => import("../pages/customer/Dashboard"));
const Profile = lazy(() => import("../pages/customer/Profile"));
const Cart = lazy(() => import("../pages/customer/Cart"));
const Checkout = lazy(() => import("../pages/customer/Checkout"));
const MyBooking = lazy(() => import("../pages/customer/MyBooking"));
const OrderTracking = lazy(() => import("../pages/customer/OrderTracking"));
const Settings = lazy(() => import("../pages/customer/Settings"));
const AiAssistant = lazy(() => import("../pages/customer/AiAssistant"));
const Reviews = lazy(() => import("../pages/customer/Reviews"));
const Recommendations = lazy(() => import("../pages/customer/Recommendations"));

export const privateRoutes = [
  {
    path: "/customer",
    element: <RoleBasedRoute allowedRoles={["Customer"]} />,
    children: [
      {
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "booking-history",
            element: <MyBooking />,
          },
          {
            path: "cart",
            element: <Cart />,
          },
          {
            path: "checkout",
            element: <Checkout />,
          },
          {
            path: "order-tracking",
            element: <OrderTracking />,
          },
          {
            path: "orders",
            element: <OrderTracking />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "ai-assistant",
            element: <AiAssistant />,
          },
          {
            path: "reviews",
            element: <Reviews />,
          },
          {
            path: "recommendations",
            element: <Recommendations />,
          },
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

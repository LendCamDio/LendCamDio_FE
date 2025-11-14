import { Navigate } from "react-router-dom";
import { RoleBasedRoute } from "./RoleBasedRoute";
import { lazy } from "react";

// Lazy load customer pages
const Dashboard = lazy(() => import("../pages/customer/Dashboard"));
const Profile = lazy(() => import("../pages/customer/Profile"));
const MyBooking = lazy(() => import("../pages/customer/MyBooking"));
const OrderTracking = lazy(() => import("../pages/customer/OrderTracking"));
const Settings = lazy(() => import("../pages/customer/Settings"));
const AiAssistant = lazy(() => import("../pages/customer/AiAssistant"));
const Reviews = lazy(() => import("../pages/customer/Reviews"));
const Recommendations = lazy(() => import("../pages/customer/Recommendations"));
const BookingListPage = lazy(() => import("../pages/customer/BookingListPage"));
const MyRentalsPage = lazy(() => import("../pages/customer/MyRentalsPage"));
const RentalPaymentPage = lazy(() => import("../pages/customer/RentalPaymentPage"));
const PaymentSuccessPage = lazy(() => import("../pages/customer/PaymentSuccessPage"));
const PaymentFailedPage = lazy(() => import("../pages/customer/PaymentFailedPage"));
const PaymentPage = lazy(() => import("../pages/PaymentPage"));
const PaymentTestPage = lazy(() => import("../pages/PaymentTestPage"));

// New shopping flow pages
const CartPage = lazy(() => import("../pages/Cart"));
const CheckoutPage = lazy(() => import("../pages/Checkout"));
const OrdersPage = lazy(() => import("../pages/Orders"));
const OrderDetailPage = lazy(() => import("../pages/OrderDetail"));

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
            path: "order-tracking",
            element: <OrderTracking />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
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
          { path: "rentals", element: <MyRentalsPage /> },
          { path: "rentals/:rentalId/payment", element: <RentalPaymentPage /> },
        ],
      },
    ],
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "/order/:orderId",
    element: <OrderDetailPage />,
  },
  {
    path: "/bookings",
    element: <BookingListPage />,
  },
  {
    path: "/payment/success",
    element: <PaymentSuccessPage />,
  },
  {
    path: "/payment/failed",
    element: <PaymentFailedPage />,
  },
  {
    path: "/payment/cancel",
    element: <PaymentFailedPage />,
  },
  {
    path: "/payment/test",
    element: <PaymentTestPage />,
  },
  {
    path: "/payment/:paymentId",
    element: <PaymentPage />,
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

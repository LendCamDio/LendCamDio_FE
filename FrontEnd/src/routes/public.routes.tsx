import { lazy } from "react";
import ErrorPage from "@/pages/Error";

// Lazy load the Home component
const Home = lazy(() => import("@/pages/Home"));
const StudioBooking = lazy(() => import("@/pages/StudioBooking"));
const CameraRental = lazy(() => import("@/pages/CameraRental"));
const Products = lazy(() => import("@/pages/Products"));
const Contacts = lazy(() => import("@/pages/Contacts"));

// Define public routes
export const publicRoutes = [
  { path: "", element: <Home />, errorElement: <ErrorPage /> },
  {
    path: "/studios",
    element: <StudioBooking />,
  },
  {
    path: "/studios/:id",
    element: <div>StudioDetail</div>,
  },
  { path: "/cameras", element: <CameraRental />, errorElement: <ErrorPage /> },
  { path: "/products", element: <Products />, errorElement: <ErrorPage /> },
  { path: "/contact", element: <Contacts />, errorElement: <ErrorPage /> },
];

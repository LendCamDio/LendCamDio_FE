import { lazy } from "react";

// Lazy load the Home component
const Home = lazy(() => import("../pages/Home"));

// Define public routes
export const publicRoutes = [
  { path: "", element: <Home /> },
  { path: "equipment/:id", element: <div>EquipmentDetailPage</div> },
];

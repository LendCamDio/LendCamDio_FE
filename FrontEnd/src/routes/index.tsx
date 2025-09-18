import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routesConfig } from "./routes.config";

const AppRoutes = () => {
  const router = createBrowserRouter(routesConfig);
  return <RouterProvider router={router} />;
};

export default AppRoutes;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routesConfig } from "./routes.config";
import { Toaster } from "sonner";
import { useAnalytics } from "@/hooks/google/useAnalytics";

const AppRoutes = () => {
  const router = createBrowserRouter(routesConfig);
  useAnalytics(); // track route changes
  return (
    <>
      <Toaster position="top-center" closeButton={true} expand={false} />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;

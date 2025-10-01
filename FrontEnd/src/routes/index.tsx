import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routesConfig } from "./routes.config";
import { Toaster } from "sonner";

const AppRoutes = () => {
  const router = createBrowserRouter(routesConfig);
  return (
    <>
      <Toaster position="top-center" closeButton expand={false} />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;

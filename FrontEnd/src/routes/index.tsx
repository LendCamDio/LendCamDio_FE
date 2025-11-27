import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routesConfig } from "./routes.config";
import { Toaster } from "sonner";
import { useEffect } from "react";

const router = createBrowserRouter(routesConfig);

const AppRoutes = () => {
  useEffect(() => {
    const unsub = router.subscribe(() => {
      const { pathname, search } = router.state.location;

      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_path: pathname + search,
        });
      }
    });

    return unsub;
  }, []);
  return (
    <>
      <Toaster position="top-center" closeButton={true} expand={false} />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;

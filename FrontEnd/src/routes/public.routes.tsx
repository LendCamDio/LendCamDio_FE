import { lazy as lazyImport } from "react";
import { getEquipmentById } from "@/services/equipmentService";
import ErrorPage from "@/pages/Error";
import type { Equipment } from "@/types/entity.type";
import type { LoaderFunctionArgs } from "react-router-dom";
// Lazy load the Home component
const Home = lazyImport(() => import("@/pages/Home/Home"));
const StudioBooking = lazyImport(() => import("@/pages/Studio/StudioBooking"));
const StudioDetail = lazyImport(() => import("@/pages/Studio/StudioDetail"));
const CameraRental = lazyImport(() => import("@/pages/CameraRental"));
const Products = lazyImport(() => import("@/pages/Product/Products"));
const ProductDetail = lazyImport(() => import("@/pages/Product/ProductDetail"));
const Contacts = lazyImport(() => import("@/pages/Contacts"));
const VerifyEmail = lazyImport(() => import("@/pages/VerifyEmail"));

// Define public routes
export const publicRoutes = [
  {
    path: "",
    element: <Home />,
    errorElement: <ErrorPage />,
    handle: {
      breadcrumb: () => "Home",
    },
  },
  {
    path: "/studios",
    children: [
      {
        index: true,
        element: <StudioBooking />,
        handle: { breadcrumb: () => "Studios" },
      },
      {
        path: "/studios/:id",
        element: <StudioDetail />,
        loader: async ({ params }: LoaderFunctionArgs) => {
          const { id } = params;
          if (!id) throw new Error("ID is required");
          const response = await getEquipmentById(id);
          return response.data;
        },
        handle: {
          breadcrumb: (data: Equipment) => data.name || "Studio",
        },
      },
    ],
    element: <StudioBooking />,
    handle: {
      breadcrumb: () => "Studio",
    },
  },
  { path: "/cameras", element: <CameraRental />, errorElement: <ErrorPage /> },
  {
    path: "/products",
    children: [
      {
        index: true,
        element: <Products />,
        handle: { breadcrumb: () => "Products" },
      },
      {
        path: "/products/product-detail/:id",
        element: <ProductDetail />,
        loader: async ({ params }: LoaderFunctionArgs) => {
          const { id } = params;
          if (!id) throw new Error("ID is required");
          const response = await getEquipmentById(id);
          if (!response.success) {
            throw new Error(
              response.error?.message || "Failed to load product"
            );
          }
          return response.data;
        },
        handle: {
          breadcrumb: (data: Equipment) => data.name || "Item",
        },
      },
    ],
    errorElement: <ErrorPage />,
    handle: { breadcrumb: () => "Products" },
  },

  {
    path: "/contact",
    element: <Contacts />,
    errorElement: <ErrorPage />,
    handle: {
      breadcrumb: () => "Studio",
    },
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
];

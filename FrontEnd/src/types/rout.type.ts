import type { ReactNode } from "react";

export type RouteHandle = {
  breadcrumb?: (data?: unknown) => string | ReactNode;
};

export type BreadcrumbItem = {
  path: string;
  breadcrumb: string;
  isDetail: boolean;
};

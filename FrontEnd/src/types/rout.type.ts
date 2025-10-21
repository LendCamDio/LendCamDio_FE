import type animations from "@/components/common/PageTransaction/animations";
import type { ReactNode } from "react";

export type RouteHandle = {
  breadcrumb?: (data?: unknown) => string | ReactNode;
};

export type BreadcrumbItem = {
  path: string;
  breadcrumb: string;
  isDetail: boolean;
};

export interface PageTransitionProps {
  children: ReactNode;
  animation?: keyof typeof animations;
}

import {
  Link,
  useLoaderData,
  useLocation,
  useMatches,
  useParams,
} from "react-router-dom";
import { useMemo } from "react";
import type { RouteHandle, BreadcrumbItem } from "@/types/rout.type";
import type { Equipment } from "@/types/entity.type";

//Regex pattern
const GUID_PATTERN =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

// Utility functions
const isGuid = (str: string): boolean => GUID_PATTERN.test(str);
const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

// CSS classes
const STYLES = {
  link: "hover:text-[var(--primary-color)] dark:hover:text-blue-400 transition-colors duration-200",
  active: "font-semibold text-gray-700 dark:text-gray-200 capitalize",
  separator: "mx-2 text-gray-300 dark:text-[var(--text-light)]",
  disabled: "font-semibold text-gray-400 dark:text-gray-500 capitalize",
  loading: "animate-pulse bg-gray-200 dark:bg-gray-700 h-5 w-24 rounded",
} as const;

export const Breadcrumbs = ({ className = "" }: { className?: string }) => {
  const matches = useMatches();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const equipment = useLoaderData() as Equipment | undefined;

  const pathnames = useMemo(
    () => location.pathname.split("/").filter((x) => x),
    [location.pathname]
  );
  const hasValidId = useMemo(() => Boolean(id && isGuid(id)), [id]);

  const crumbs = useMemo<BreadcrumbItem[]>(() => {
    return matches
      .filter((match) => (match.handle as RouteHandle)?.breadcrumb)
      .map((match) => {
        const handle = match.handle as RouteHandle;
        const matchIndex = matches.indexOf(match);
        const baseBreadcrumb =
          handle.breadcrumb?.(match.loaderData) || pathnames[matchIndex];

        const isDetailRoute = match.pathname.includes(":id");

        const detailType = isDetailRoute
          ? pathnames[pathnames.length - 2] || "Detail"
          : null;

        return {
          path: match.pathname,
          breadcrumb:
            isDetailRoute && detailType
              ? capitalizeFirstLetter(detailType)
              : String(baseBreadcrumb),
          isDetail: isDetailRoute,
        };
      });
  }, [matches, pathnames]);

  // Empty state - only show Home link
  if (crumbs.length === 0 && pathnames.length === 0) {
    return (
      <nav
        className={`text-gray-500 my-4 ${className}`}
        aria-label="Breadcrumb"
      >
        <Link to="/" className={STYLES.link}>
          Home
        </Link>
      </nav>
    );
  }
  const renderCrumb = (crumb: BreadcrumbItem, index: number) => {
    const isLast = index === crumbs.length - 1;

    // Detail route without valid ID - show as disabled
    if (crumb.isDetail && !hasValidId) {
      return (
        <span key={crumb.path} className="flex items-center">
          <span className={STYLES.separator}>/</span>
          <span className={STYLES.disabled}>{crumb.breadcrumb}</span>
        </span>
      );
    }
    // Last item with valid ID
    if (isLast && hasValidId && equipment) {
      return (
        <span key={crumb.path} className="flex items-center">
          <span className={STYLES.separator}>/</span>
          <Link to={crumb.path.replace(":id", "")} className={STYLES.link}>
            {crumb.breadcrumb}
          </Link>
        </span>
      );
    }

    // Middle items - show as clickable links
    return (
      <span key={crumb.path} className="flex items-center">
        <span className={STYLES.separator}>/</span>
        <Link to={crumb.path} className={STYLES.link}>
          {isLast ? (
            crumb.breadcrumb
          ) : (
            <Link to={crumb.path}>{crumb.breadcrumb}</Link>
          )}
        </Link>
      </span>
    );
  };

  return (
    <nav
      className={`text-[var(--text-light)] dark:text-gray-400 my-4 flex items-center flex-wrap gap-2 ${className}`}
      aria-label="Breadcrumb"
    >
      <Link to="/" className={STYLES.link}>
        Home
      </Link>
      {crumbs.map(renderCrumb)}
    </nav>
  );
};

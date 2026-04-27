"use client";

import { usePathname } from "next/navigation";
import { formatSegment } from "../utils/breadcrumbUtils";
import {
  breadcrumbLabels,
  nonClickableBreadcrumbRoutes,
} from "../../config/breadcrumb.config";

export interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
  isClickable: boolean;
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    return {
      label: breadcrumbLabels[href] ?? formatSegment(segment),
      href,
      isLast,
      isClickable: !isLast && !nonClickableBreadcrumbRoutes.has(href),
    };
  });
}

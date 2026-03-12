import { usePathname } from "next/navigation";
import { formatSegment } from "../utils/breadcrumbUtils";

export interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => ({
    label: formatSegment(segment),
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }));
}

"use client";

import AnimatedLink from "@/ui/animations/AnimatedLink";
import { useBreadcrumb } from "../hooks/useBreadcrumb";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function Breadcrumb() {
  const items = useBreadcrumb();

  if (!items.length) return null;

  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center shadow-lg gap-1 text-xl bg-bg-separator rounded-xl px-6 py-3"
    >
      {items.map(({ label, href, isLast, isClickable }, index) => (
        <span key={href} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRightIcon className="w-5 h-5 text-text-muted shrink-0" />
          )}

          {isLast ? (
            <span aria-current="page" className="text-secondary font-medium">
              {label}
            </span>
          ) : isClickable ? (
            <AnimatedLink
              href={href}
              label={label}
              textClassName="text-primary group-hover:text-secondary"
              underlineClassName="w-0 group-hover:w-full"
            />
          ) : (
            <span className="text-text-muted font-medium">{label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

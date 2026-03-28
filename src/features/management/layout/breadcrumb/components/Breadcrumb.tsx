"use client";

import AnimatedLink from "@/ui/animations/AnimatedLink";
import { useBreadcrumb } from "../hooks/useBreadcrumb";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function Breadcrumb() {
  const items = useBreadcrumb();

  return (
    <nav className="flex items-center shadow-lg gap-1 text-xl bg-bg-separator rounded-xl px-6 py-3">
      <AnimatedLink
        href="/"
        label="Inicio"
        textClassName="text-primary group-hover:text-secondary"
        underlineClassName="w-0 group-hover:w-full"
      />
      {items.map(({ label, href, isLast }) => (
        <span key={href} className="flex items-center gap-1">
          <ChevronRightIcon className="w-5 h-5 text-text-muted shrink-0" />
          {isLast ? (
            <span className="text-secondary font-medium">{label}</span>
          ) : (
            <AnimatedLink
              href={href}
              label={label}
              textClassName="text-primary group-hover:text-secondary"
              underlineClassName="w-0 group-hover:w-full"
            />
          )}
        </span>
      ))}
    </nav>
  );
}

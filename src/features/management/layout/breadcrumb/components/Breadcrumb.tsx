"use client";

import { useState } from "react";
import AnimatedLink from "@/components/layout/AnimatedLink";
import { MarqueeText } from "@/components/common/MarqueeText";
import { useBreadcrumb } from "../hooks/useBreadcrumb";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Breadcrumb() {
  const items = useBreadcrumb();
  const [isTrailOpen, setIsTrailOpen] = useState(false);

  if (!items.length) return null;

  const lastItem = items[items.length - 1];
  const previousItems = items.slice(0, -1);

  return (
    <nav
      aria-label="breadcrumb"
      className="relative z-30 flex items-center gap-1 sm:gap-1.5 text-sm sm:text-base md:text-lg bg-white/65 backdrop-blur-xl border border-white/50 shadow-md rounded-2xl px-4 py-2.5 md:px-5 md:py-3"
    >
      {/* Móvil (< md): siempre 1 sola línea compacta (... > Ruta actual) */}
      <div className="flex md:hidden items-center gap-1 min-w-0 w-full whitespace-nowrap">
        {previousItems.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setIsTrailOpen((prev) => !prev)}
              className="px-1.5 py-0.5 rounded-md text-primary hover:bg-white/70 font-bold shrink-0 cursor-pointer"
              aria-label="Ver ruta anterior"
            >
              ...
            </button>
            <ChevronRightIcon className="w-4 h-4 text-text-muted shrink-0" />
          </>
        )}
        <div aria-current="page" className="min-w-0 flex-1 text-secondary font-medium">
          <MarqueeText text={lastItem.label} />
        </div>
      </div>

      {/* Tablet y Desktop (md+): ruta completa */}
      <div className="hidden md:flex flex-wrap items-center gap-1.5 min-w-0">
        {items.map(({ label, href, isLast, isClickable }, index) => (
          <span key={href} className="flex items-center gap-1.5">
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
      </div>
      {/* Popover móvil con niveles anteriores */}
      {isTrailOpen && previousItems.length > 0 && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Cerrar ruta"
            onClick={() => setIsTrailOpen(false)}
            className="fixed inset-0 z-20 cursor-default bg-transparent"
          />
          <div className="md:hidden absolute left-4 top-full mt-1.5 z-40 min-w-[200px] max-w-[80vw] rounded-xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl p-1.5 space-y-0.5">
            {previousItems.map((item) =>
              item.isClickable ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsTrailOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-primary font-medium hover:bg-primary/10 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.href}
                  className="block px-3 py-2 text-sm text-text-muted font-medium"
                >
                  {item.label}
                </span>
              )
            )}
          </div>
        </>
      )}
    </nav>
  );
}

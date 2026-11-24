"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import CroppedLogo, { LOGO_CROQUIS_ICON } from "@/ui/general/CroppedLogo";
import InstitutionalStripe from "@/ui/decorators/InstitutionalStripe";
import LoginPanel from "../../login/components/LoginPanel";
import { homeNavItems } from "../config/HomeNavItems";
import { NavItemType } from "../types/navbar.types";
import { useActiveNavHref } from "../hooks/useActiveNavHref";

/** CTA del menú móvil (prototipo "Overlay · Menú Mobile"). */
const MOBILE_CTA = { label: "Participar en el próximo Retorno", href: "/auth/registro" };

/**
 * Menú de navegación para pantallas < `lg` (prototipo "Overlay · Menú Mobile").
 *
 * - Botón hamburguesa que abre un panel a pantalla completa con los mismos
 *   enlaces de `homeNavItems`, la franja institucional y el CTA.
 * - "Login" despliega el mismo `LoginPanel` del escritorio, en línea.
 * - Se cierra con la X, con Esc o al elegir un enlace (todos llaman a `close`).
 * - Mientras está abierto bloquea el scroll de la página.
 */
export default function HomeMobileMenu() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isActive = useActiveNavHref(
    homeNavItems.flatMap((item) => (item.type === NavItemType.LINK ? [item.href] : [])),
  );

  const close = () => {
    setOpen(false);
    setShowLogin(false);
  };

  // Esc, bloqueo de scroll y foco inicial en "cerrar" mientras está abierto.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        aria-controls="menu-movil"
        className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-text-inverse/15 text-text-inverse transition-colors hover:bg-text-inverse/25 lg:hidden"
      >
        <Bars3Icon className="size-6" />
      </button>

      {open && (
        <div
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-primary px-6 pb-10 pt-6 lg:hidden"
        >
          <div className="flex items-center justify-between">
            <Link href="/" onClick={close} aria-label="Caravana del Retorno, ir al inicio">
              <CroppedLogo logo={LOGO_CROQUIS_ICON} className="w-[170px]" />
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Cerrar menú"
              className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-text-inverse/15 text-text-inverse transition-colors hover:bg-text-inverse/25"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>

          <nav aria-label="Navegación principal" className="mt-10 flex flex-col gap-6">
            {homeNavItems.map((item) => {
              if (item.type === NavItemType.LINK) {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={`w-fit border-b-2 pb-1 text-2xl font-semibold transition-colors ${
                      active
                        ? "border-secondary text-secondary"
                        : "border-transparent text-text-inverse hover:text-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }
              if (item.type === NavItemType.LOGIN) {
                return (
                  <div key={item.label} className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setShowLogin((prev) => !prev)}
                      aria-expanded={showLogin}
                      className="w-fit cursor-pointer text-left text-2xl font-semibold text-text-inverse hover:text-secondary"
                    >
                      {item.label}
                    </button>
                    {showLogin && (
                      <LoginPanel
                        onClose={close}
                        className="w-full rounded-xl border border-text-inverse/20 text-text-inverse"
                      />
                    )}
                  </div>
                );
              }
              return null;
            })}
          </nav>

          <InstitutionalStripe className="mt-10 h-1.5 w-full" />

          <Link
            href={MOBILE_CTA.href}
            onClick={close}
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-4 text-sm font-semibold text-primary"
          >
            {MOBILE_CTA.label}
            <Image src="/home/icons/flecha-cta.svg" alt="" width={18} height={18} />
          </Link>
        </div>
      )}
    </>
  );
}

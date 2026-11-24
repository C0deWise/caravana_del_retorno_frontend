"use client";

import { NavItemType } from "../types/navbar.types";
import { homeNavItems } from "../config/HomeNavItems";
import HomeNavLink from "./HomeNavLink";
import LoginPanel from "../../login/components/LoginPanel";
import { useState } from "react";
import { useActiveNavHref } from "../hooks/useActiveNavHref";

export default function HomeNavbar() {
  // Activo por ruta, o por sección visible para los enlaces con ancla (#).
  const isActive = useActiveNavHref(
    homeNavItems.flatMap((item) => (item.type === NavItemType.LINK ? [item.href] : [])),
  );
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav
      className="flex h-full max-w-390 justify-between items-center gap-4 font-semibold text-(--color-text-inverse) lg:text-lg xl:text-xl xl:px-5"
      aria-label="Navegación principal"
    >
      {homeNavItems.map((item) => {
        if (item.type === NavItemType.LINK) {
          return (
            <HomeNavLink
              key={item.label}
              href={item.href}
              label={item.label}
              isActive={isActive(item.href)}
            />
          );
        }

        if (item.type === NavItemType.DROPDOWN) {
          return <></>;
        }

        if (item.type === NavItemType.LOGIN) {
          return (
            <div key={item.label} className="relative">
              <button
                className="cursor-pointer"
                onClick={() => setShowLogin((prev) => !prev)}
              >
                Login
              </button>
              {showLogin && <LoginPanel onClose={() => setShowLogin(false)} />}
            </div>
          );
        }
      })}
    </nav>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { NavItemType } from "../types/navbar.types";
import { homeNavItems } from "../config/HomeNavItems";
import HomeNavLink from "./HomeNavLink";
import LoginPanel from "../../login/components/LoginPanel";
import { useState } from "react";

export default function HomeNavbar() {
  const pathName = usePathname();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav
      className="flex h-full max-w-390 justify-between items-center text-3xl font-semibold text-(--color-text-inverse) md:text-xl md:px-5"
      aria-label="Navegación principal"
    >
      {homeNavItems.map((item) => {
        if (item.type === NavItemType.LINK) {
          return (
            <HomeNavLink
              key={item.label}
              href={item.href}
              label={item.label}
              isActive={pathName === item.href}
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

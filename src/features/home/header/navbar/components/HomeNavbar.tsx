"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavItemType } from "../types/navbar.types";
import { homeNavItems } from "../config/HomeNavItems";
import HomeNavLink from "./HomeNavLink";
import LoginPanel from "../../login/components/LoginPanel";
import { useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";

export default function HomeNavbar() {
  const pathName = usePathname();
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav
      className="flex h-full justify-evenly items-center text-3xl font-semibold text-(--color-text-inverse) md:text-xl md:px-5 md:gap-4 flex-wrap md:flex-nowrap md:min-w-0"
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
          if (isAuthenticated) {
            return (
              <div key={item.label} className="flex items-center gap-4 text-lg md:text-base">
                <Link
                  href="/gestion"
                  className="px-5 py-2.5 rounded-xl bg-white text-primary font-black hover:bg-gray-100 transition-all shadow-sm active:scale-95"
                >
                  Ir a gestión
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-red text-white font-black hover:brightness-110 transition-all shadow-sm active:scale-95 border-none"
                >
                  <ArrowLeftEndOnRectangleIcon className="w-6 h-6 stroke-[2.5]" />
                  Cerrar sesión
                </button>
              </div>
            );
          }

          return (
            <div key={item.label} className="relative">
              <button
                className={`relative cursor-pointer font-bold transition-colors group py-1 ${
                  showLogin ? "text-secondary" : "hover:text-secondary text-text-inverse"
                }`}
                onClick={() => setShowLogin((prev) => !prev)}
              >
                {"Iniciar Sesión"}
                <span className={`absolute left-0 -bottom-1 h-0.5 bg-secondary transition-all duration-300 ${
                  showLogin ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </button>
              {showLogin && <LoginPanel onClose={() => setShowLogin(false)} />}
            </div>
          );
        }
      })}
    </nav>
  );
}

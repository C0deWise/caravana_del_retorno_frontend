"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavItemType } from "../types/navbar.types";
import { homeNavItems } from "../config/HomeNavItems";
import HomeNavLink from "./HomeNavLink";
import LoginPanel from "../../login/components/LoginPanel";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";

interface HomeNavbarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function HomeNavbar({ isMobile = false, onClose }: HomeNavbarProps) {
  const pathName = usePathname();
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setShowLogin(false);
      }
    }
    if (showLogin) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogin]);

  return (
    <nav
      className={`flex w-full ${isMobile ? 'flex-col items-center gap-6 text-xl' : 'h-full justify-evenly items-center text-xl px-5 gap-4 flex-nowrap min-w-0'} font-semibold text-text-inverse`}
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
              onClick={onClose}
            />
          );
        }

        if (item.type === NavItemType.DROPDOWN) {
          return <></>;
        }

        if (item.type === NavItemType.LOGIN) {
          if (isAuthenticated) {
            return (
              <div key={item.label} className={`flex items-center gap-4 ${isMobile ? 'flex-col mt-4 w-full' : 'text-lg md:text-base'}`}>
                <Link
                  href="/gestion"
                  onClick={onClose}
                  className={`px-5 py-2.5 rounded-xl bg-white text-primary font-black hover:bg-gray-100 transition-all shadow-sm active:scale-95 ${isMobile ? 'w-full text-center' : ''}`}
                >
                  Ir a gestión
                </Link>
                <button
                  onClick={() => {
                    logout();
                    onClose?.();
                  }}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent-red text-white font-black hover:brightness-110 transition-all shadow-sm active:scale-95 border-none ${isMobile ? 'w-full text-center' : ''}`}
                >
                  <ArrowLeftEndOnRectangleIcon className="w-6 h-6 stroke-[2.5]" />
                  Cerrar sesión
                </button>
              </div>
            );
          }

          return (
            <div key={item.label} ref={loginRef} className={`relative ${isMobile ? 'mt-4 w-full flex justify-center' : ''}`}>
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
              <LoginPanel isVisible={showLogin} isMobile={isMobile} onClose={() => setShowLogin(false)} />
            </div>
          );
        }
      })}
    </nav>
  );
}

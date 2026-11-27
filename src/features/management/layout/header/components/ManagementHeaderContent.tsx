"use client";

import { useAuth } from "@/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import MainIcon from "@/components/common/MainIcon";
import MainText from "@/components/common/MainText";
import HeaderCurve from "@/components/layout/HeaderCurve";
import Link from "next/link";
import { ArrowLeftEndOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/outline";
import NotificationsDropdown from "@/features/notifications/components/NotificationsDropdown";
import { useSidebarContext } from "../../sidebar/components/SidebarContext";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrador",
  lider_colonia: "Líder de colonia",
  usuario: "Usuario",
};

export default function ManagementHeaderContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toggleMobile } = useSidebarContext();

  const handleLogout = () => {
    logout();
    router.push("/inicio");
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-2.5 bg-primary relative shadow-[0_6px_12px_-2px_rgba(0,0,0,0.28)]">
      {/* Izquierda: Hamburguesa en móvil + Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleMobile}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-text-inverse hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Abrir menú de navegación"
        >
          <Bars3Icon className="w-7 h-7" />
        </button>

        <Link href="/inicio" className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <MainIcon className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 lg:w-[50px] lg:h-[50px]" size={50} />
          <span className="hidden sm:block self-stretch w-1 rounded-4xl bg-bg my-1" />
          <MainText className="hidden sm:block mt-1.5 -ml-1.5" size={110} />
        </Link>
      </div>

      {/* Centro: Título del panel solo en desktop */}
      <span className="hidden xl:block text-text-inverse text-xl font-semibold tracking-widest uppercase truncate">
        {user?.role === "usuario" ? "Panel de usuario" : "Panel de gestión"}
      </span>

      {/* Derecha: Notificaciones + Usuario + Cerrar sesión (en móvil solo notificaciones) */}
      {user && (
        <div className="flex items-center gap-3 sm:gap-5 lg:gap-7 shrink-0">
          <NotificationsDropdown />

          <div className="hidden md:flex flex-col items-end justify-center gap-1">
            <span className="text-sm lg:text-lg font-bold text-text-inverse leading-none truncate max-w-[160px] lg:max-w-none">
              {user.nombre} {user.apellido}
            </span>
            <span className="text-[10px] lg:text-xs font-black text-primary bg-white px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-full leading-none shadow-sm uppercase tracking-wide">
              {ROLE_LABEL[user.role] ?? user.role}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="hidden md:flex items-center justify-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 rounded-xl bg-accent-red text-white text-sm font-bold hover:brightness-110 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <ArrowLeftEndOnRectangleIcon className="w-5 h-5 lg:w-6 lg:h-6 stroke-[2.2]" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}

      <HeaderCurve />
    </div>
  );
}

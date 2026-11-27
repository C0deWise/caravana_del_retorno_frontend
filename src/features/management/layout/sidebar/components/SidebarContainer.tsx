"use client";

import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/context/AuthContext";
import { useSidebarContext } from "./SidebarContext";
import SidebarToggle from "./SidebarToggle";
import SidebarMenu from "./SidebarMenu";
import { MarqueeText } from "@/components/common/MarqueeText";

export default function SidebarContainer() {
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebarContext();
  const { user, logout } = useAuth();
  const router = useRouter();

  const ROLE_LABEL: Record<string, string> = {
    admin: "Administrador",
    lider_colonia: "Líder de colonia",
    usuario: "Usuario",
  };

  const handleLogout = () => {
    closeMobile();
    logout();
    router.push("/inicio");
  };

  return (
    <>
      {/* Desktop y Tablet (md+) */}
      <aside
        className={`hidden md:flex bg-white/65 backdrop-blur-xl border border-white/50 shadow-md rounded-2xl h-full flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
        }`}
      >
        <SidebarToggle />
        <SidebarMenu />
      </aside>

      {/* Móvil (< md): Drawer deslizable */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobile-sidebar-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] md:hidden flex"
          >
            <div
              onClick={closeMobile}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10 w-72 max-w-[82vw] h-full bg-white/95 border-r border-white/50 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-lg font-bold text-primary">Menú principal</span>
                <button
                  type="button"
                  onClick={closeMobile}
                  aria-label="Cerrar menú"
                  className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-sm transition-colors cursor-pointer"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="px-4">
                <div className="h-1 w-full rounded-full overflow-hidden flex">
                  <div className="flex-1 bg-[#f28f38]" />
                  <div className="flex-1 bg-[#038c4a]" />
                  <div className="flex-1 bg-[#eabe03]" />
                  <div className="flex-1 bg-[#ec1e25]" />
                </div>
              </div>
              <SidebarMenu />

              <div className="p-4 border-t border-gray-200/70 space-y-3">
                {user && (
                  <div className="flex flex-col items-start gap-1.5 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="w-full text-sm font-bold text-primary">
                      <MarqueeText text={`${user.nombre} ${user.apellido}`} />
                    </div>
                    <span className="text-[10px] font-black text-white bg-primary px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      {ROLE_LABEL[user.role] ?? user.role}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-accent-red text-white text-sm font-bold hover:brightness-110 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <ArrowLeftEndOnRectangleIcon className="w-5 h-5 stroke-[2.2]" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

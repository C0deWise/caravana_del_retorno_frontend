"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  openMenus: Record<string, boolean>;
  toggleMenu: (href: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMenu = (href: string) =>
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggleCollapse, openMenus, toggleMenu }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebarContext debe usarse dentro de SidebarProvider");
  return context;
}

"use client";

import { useSidebarContext } from "./SidebarContext";
import SidebarMenuItem from "./SidebarMenuItem";
import { getMenuByRole } from "../../utils/getMenuByRole";
import { useAuth } from "@/auth/context/AuthContext";

export default function SidebarMenu() {
  const { isCollapsed } = useSidebarContext();
  const { user, isHydrating } = useAuth();

  if (isHydrating) {
    return null;
  }

  const filteredMenu = getMenuByRole(user);

  const tieneColonia = Boolean(user?.codigo_colonia);

  // Flatten the menu to show direct routes and remove category nesting
  const flatMenu = filteredMenu.flatMap(module => 
    (module.subitems || []).map(subitem => ({
      ...subitem,
      icon: module.icon // Inherit parent icon
    }))
  ).filter(item => {
    if (item.href === "/gestion/retorno/registro" || item.href === "/gestion/retorno/grupos") {
      return tieneColonia;
    }
    return true;
  });

  return (
    <nav className="flex-1 p-4 overflow-hidden overflow-y-auto custom-scrollbar">
      <div className="mb-4 pb-4 border-b border-bg-border/60">
        <SidebarMenuItem
          item={{ label: "Inicio del Panel", href: "/gestion", icon: "dashboard" }}
          isCollapsed={isCollapsed}
        />
      </div>

      <div className="space-y-2">
        {flatMenu.map((item) => (
          <SidebarMenuItem
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </nav>
  );
}

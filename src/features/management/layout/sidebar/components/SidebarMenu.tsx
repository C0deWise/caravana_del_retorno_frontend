"use client";

import { menuConfig } from "../config/menuConfig";
import { useSidebarContext } from "./SidebarContext";
import SidebarMenuItem from "./SidebarMenuItem";

export default function SidebarMenu() {
  const { isCollapsed } = useSidebarContext();

  return (
    <nav className="flex-1 p-4 space-y-2 overflow-hidden">
      {menuConfig.map((item) => (
        <SidebarMenuItem
          key={item.href}
          item={item}
          isCollapsed={isCollapsed}
        />
      ))}
    </nav>
  );
}

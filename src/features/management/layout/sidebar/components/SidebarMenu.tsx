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

  return (
    <nav className="flex-1 p-4 space-y-2 overflow-hidden">
      {filteredMenu.map((item) => (
        <SidebarMenuItem
          key={item.href}
          item={item}
          isCollapsed={isCollapsed}
        />
      ))}
    </nav>
  );
}

"use client";

import { useSidebarContext } from "./SidebarContext";
import SidebarToggle from "./SidebarToggle";
import SidebarMenu from "./SidebarMenu";

export default function SidebarContainer() {
  const { isCollapsed } = useSidebarContext();

  return (
    <aside
      className={`bg-bg-separator shadow-xl rounded-xl h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
      }`}
    >
      <SidebarToggle />
      <SidebarMenu />
    </aside>
  );
}

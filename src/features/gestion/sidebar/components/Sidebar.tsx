"use client";

import { SidebarProvider } from "./SidebarContext";
import SidebarContainer from "./SidebarContainer";

export default function Sidebar() {
  return (
    <SidebarProvider>
      <SidebarContainer />
    </SidebarProvider>
  );
}

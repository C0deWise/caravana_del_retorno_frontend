"use client";

import { ListBulletIcon } from "@heroicons/react/24/solid";
import { useSidebarContext } from "./SidebarContext";
import HorizontalSeparator from "@/components/layout/HorizontalSeparator";

export default function SidebarToggle() {
  const { isCollapsed, toggleCollapse } = useSidebarContext();

  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={toggleCollapse}
        className={`w-full flex items-center pl-7 pr-4 pt-4 justify-start text-primary hover:bg-white/50 rounded-t-2xl transition-all duration-300 cursor-pointer ${
          isCollapsed ? "pb-2" : "pb-4"
        }`}
      >
        <ListBulletIcon className="w-6 h-6 shrink-0 transition-colors" />
        <span
          className={`truncate text-lg font-bold transition-all duration-300 ease-in-out ml-4 ${
            isCollapsed
              ? "opacity-0 w-0 scale-x-50 -translate-x-2"
              : "opacity-100 w-full scale-x-100 translate-x-0"
          }`}
        >
          Menú principal
        </span>
      </button>
      <div
        className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "h-0 opacity-0 scale-x-50" : "h-1 opacity-100 scale-x-100"
        }`}
      >
        <div className="h-1 w-full rounded-full overflow-hidden">
          <HorizontalSeparator />
        </div>
      </div>
    </div>
  );
}

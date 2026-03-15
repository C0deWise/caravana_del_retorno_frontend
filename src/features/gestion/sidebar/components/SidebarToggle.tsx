"use client";

import { ListBulletIcon } from "@heroicons/react/24/solid";
import { useSidebarContext } from "./SidebarContext";

export default function SidebarToggle() {
  const { isCollapsed, toggleCollapse } = useSidebarContext();

  return (
    <button
      onClick={toggleCollapse}
      className="flex items-center p-4 pl-8 border-b-2 border-secondary rounded-xl justify-start text-primary hover:bg-gray-100 rounded-t-xl transition-colors"
    >
      <ListBulletIcon className="w-6 h-6 shrink-0 transition-colors" />
      <span
        className={`
          truncate text-xl transition-all duration-300 ease-in-out ml-4
          ${isCollapsed
            ? "opacity-0 w-0 scale-x-50 -translate-x-2"
            : "opacity-100 w-full scale-x-100 translate-x-0"
          }
        `}
      >
        Menu principal
      </span>
    </button>
  );
}

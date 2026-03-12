"use client";

import { useState } from "react";
import AnimatedLink from "@/ui/general/AnimatedLink";
import {
  HomeIcon,
  PlusIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { menuConfig } from "../config/menuConfig";

const iconMap: Record<string, React.ReactNode> = {
  home: <HomeIcon className="w-5 h-5 shrink-0" />,
  plus: <PlusIcon className="w-4 h-4 shrink-0" />,
  arrowLeft: <ArrowLeftIcon className="w-5 h-5 shrink-0" />,
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-bg-separator shadow-xl rounded-xl h-full flex flex-col transition-all duration-300
                 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 border-b border-gray-200 hover:bg-gray-100 rounded-t-xl transition-colors"
      >
        <ChevronRightIcon
          className={`w-6 h-6 transition-transform duration-300 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuConfig.map((item) => (
          <div key={item.href}>
            <AnimatedLink
              href={item.href}
              label={
                <div className="flex gap-4 items-center">
                  <span className="shrink-0">{iconMap[item.icon]}</span>
                  {!isCollapsed && (
                    <span className="text-text font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </div>
              }
              linkClassName="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 w-full"
              underlineClassName="w-0 group-hover:w-full"
              textClassName=""
            />

            {!isCollapsed &&
              item.subitems?.map((subitem) => (
                <AnimatedLink
                  key={subitem.href}
                  href={subitem.href}
                  label={
                    <div className="flex gap-2 items-center">
                      <span className="w-4 h-4 shrink-0">
                        {iconMap[subitem.icon]}
                      </span>
                      <span className="truncate">{subitem.label}</span>
                    </div>
                  }
                  linkClassName="flex items-center gap-3 pl-10 p-2 text-sm text-text-muted hover:bg-gray-100 rounded-lg w-full"
                  underlineClassName="w-0 group-hover:w-full"
                  textClassName=""
                />
              ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

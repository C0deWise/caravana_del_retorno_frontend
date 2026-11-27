"use client";

import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { iconMap } from "../../config/icons";
import { useSidebarContext } from "./SidebarContext";
import { MenuItem } from "@/features/management/layout/types/menu.types";
import { useActivePath } from "../hooks/useActivePath";
import { useRouter } from "next/navigation";
import { MarqueeText } from "@/components/common/MarqueeText";

interface MenuItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  level?: number;
}

export default function SidebarMenuItem({
  item,
  isCollapsed,
  level = 0,
}: MenuItemProps) {
  const router = useRouter();
  const { isActive } = useActivePath();
  const { openMenus, toggleMenu, closeMobile } = useSidebarContext();

  const isOpen = openMenus[item.href];
  const isParent = !!item.subitems?.length;

  const hasActiveChild = (items?: MenuItem[]): boolean => {
    if (!items) return false;
    return items.some(
      (sub) => isActive(sub.href) || hasActiveChild(sub.subitems),
    );
  };
  const anyDescendantActive = hasActiveChild(item.subitems);

  const handleContainerClick = () => {
    if (isParent) {
      toggleMenu(item.href);
      return;
    }

    closeMobile();
    router.push(item.href);
  };

  const baseStyles = `rounded-xl transition-all flex items-center w-full relative z-10 cursor-pointer py-1.5 group hover:bg-white/60 hover:text-secondary`;
  const activeStyles =
    anyDescendantActive || isActive(item.href)
      ? "bg-white/85 shadow-sm text-primary font-semibold"
      : isOpen && isParent
        ? "bg-white/60 shadow-sm"
        : "";

  return (
    <>
      {/* Main Container */}
      <div
        className={`flex items-center gap-3 w-full ${baseStyles} ${activeStyles}`}
        onClick={handleContainerClick}
      >
        {/* Icon + Label */}
        <div
          className={`px-4 flex items-center gap-3 flex-1 min-w-0 relative z-20 ${isActive(item.href) ? "text-secondary" : ""}`}
        >
          {item.icon && (
            <span className="w-5 h-5 flex items-center justify-center shrink-0 text-lg relative z-20">
              {iconMap[item.icon] && React.createElement(iconMap[item.icon], { className: "w-5 h-5 shrink-0" })}
            </span>
          )}
          <div
            className={`min-w-0 flex-1 font-medium text-lg transition-all relative z-20 ${
              isCollapsed && level === 0
                ? "opacity-0 w-0 scale-x-50 -translate-x-2"
                : "opacity-100"
            }`}
          >
            <MarqueeText text={item.label} />
          </div>
        </div>

        {/* Chevron */}
        {isParent && (
          <ChevronDownIcon
            className={`
              w-10 h-10 text-primary transition-all duration-300 shrink-0 relative z-30
              ${isCollapsed && level === 0 ? "opacity-0 scale-0" : "opacity-100 scale-100"}
              ${isOpen ? "rotate-180 text-secondary" : ""}
              p-1 rounded-full ml-auto
            `}
          />
        )}
      </div>

      {/* Submenu */}
      {isParent && (
        <div
          className={`
            relative ml-11 space-y-1 transition-all duration-300 ease-in-out
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="absolute -left-5 top-1 bottom-1 w-px bg-gray-300 z-0 pointer-events-none" />
          {item.subitems!.map((child) => (
            <SidebarMenuItem
              key={child.href}
              item={child}
              isCollapsed={isCollapsed}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}

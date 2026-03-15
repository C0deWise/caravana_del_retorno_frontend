"use client";

import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { iconMap } from "../utils/icons";
import { useSidebarContext } from "./SidebarContext";
import { MenuItem } from "@/types/menu";
import { useActivePath } from "../hooks/useActivePath";
import { useRouter } from "next/navigation";

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
  const { openMenus, toggleMenu } = useSidebarContext();

  const isOpen = openMenus[item.href];
  const isParent = !!item.subitems?.length;
  const anyChildActive =
    item.subitems?.some((sub) => isActive(sub.href) || openMenus[sub.href]) ||
    isActive(item.href);

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isParent) toggleMenu(item.href);
  };

  const handleContainerClick = () => {
    if (!isParent || !anyChildActive) {
      router.push(item.href);
    }
  };

  const baseStyles = `rounded-lg transition-all flex items-center w-full relative z-10 cursor-pointer group`;
  const activeStyles =
    anyChildActive || isOpen
      ? "bg-gray-100 text-secondary shadow-md"
      : "hover:bg-gray-100 hover:text-secondary hover:shadow-md";

  return (
    <>
      {/* Contenedor PRINCIPAL clickable */}
      <div
        className={`flex items-center gap-3 w-full ${baseStyles} ${activeStyles}`}
        onClick={handleContainerClick}
      >
        {/* Icono + Label */}
        <div className="px-4 flex items-center gap-3 flex-1 min-w-0 relative z-20">
          {item.icon && (
            <span className="w-5 h-5 flex items-center justify-center shrink-0 text-lg relative z-20">
              {iconMap[item.icon]}
            </span>
          )}
          <span
            className={`truncate font-medium text-lg transition-all relative z-20 ${
              isCollapsed && level === 0
                ? "opacity-0 w-0 scale-x-50 -translate-x-2"
                : "opacity-100"
            }`}
          >
            {item.label}
          </span>
        </div>

        {/* Chevron por encima */}
        {isParent && (
          <ChevronDownIcon
            className={`
              w-10 h-10 transition-all duration-300 shrink-0 cursor-pointer relative z-30
              ${isCollapsed && level === 0 ? "opacity-0 scale-0" : "opacity-100 scale-100"}
              ${isOpen ? "rotate-180" : ""}
              hover:scale-110 hover:bg-gray-200 p-1 rounded ml-auto
              ${anyChildActive || isOpen ? "text-secondary" : ""}
            `}
            onClick={handleChevronClick}
          />
        )}
      </div>

      {/* Submenú */}
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

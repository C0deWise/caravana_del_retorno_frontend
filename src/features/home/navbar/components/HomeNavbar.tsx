"use client";

import { usePathname } from "next/navigation";
import { NavItemType } from "@/types/navbar.types";
import { homeNavItems } from "../config/HomeNavItems";
import HomeNavLink from "./HomeNavLink";

export default function HomeNavbar() {
  const pathName = usePathname();

  return (
    <nav
      className="flex h-full justify-between items-center text-(--color-text-inverse) md:text-2xl"
      aria-label="Navegación principal"
    >
      {homeNavItems.map((item) => {
        if (item.type === NavItemType.LINK) {
          return (
            <HomeNavLink
              key={item.label}
              href={item.href}
              label={item.label}
              isActive={pathName === item.href}
            />
          );
        }

        // if (item.type === NavItemType.DROPDOWN) {
        //   return (
        //     <NavDropdown
        //       key={item.label}
        //       label={item.label}
        //       items={item.items}
        //       currentPath={pathName}
        //     />
        //   );
        // }

        if (item.type === NavItemType.LOGIN) {
          return <div key={item.label}>Login</div>;
        }
      })}
    </nav>
  );
}

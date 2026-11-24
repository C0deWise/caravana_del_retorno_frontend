"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import AnimatedLink from "@/ui/animations/AnimatedLink";

interface HomeNavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

export default function HomeNavLink({
  href,
  label,
  isActive,
}: HomeNavLinkProps) {
  const pathname = usePathname();

  /**
   * Enlaces a una sección (`/inicio#quienes-somos`) estando ya en esa ruta:
   * Next.js considera la URL igual y no vuelve a desplazar (además duplica el
   * `#`). En ese caso se desplaza a la sección manualmente y se fija el hash.
   * Desde otra ruta, el Link navega normal y Next.js hace el scroll.
   */
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const [path, hash] = href.split("#");
    if (!hash || path !== pathname) return;
    const target = document.getElementById(hash);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `${path}#${hash}`);
  };

  return (
    <AnimatedLink
      href={href}
      label={label}
      onClick={handleClick}
      linkClassName={`text-shadow-lg ${isActive ? "text-secondary" : ""}`}
      textClassName={`text-text-inverse text-shadow-lg group-hover:text-secondary ${isActive ? "text-secondary" : ""}`}
      underlineClassName={isActive ? "w-full" : "w-0 group-hover:w-full"}
    />
  );
}

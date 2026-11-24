import { NavItem, NavItemType } from "../types/navbar.types";

export const homeNavItems: NavItem[] = [
  // Ancla a la sección "¿Quiénes somos?" de la landing (src/app/(public)/inicio/page.tsx).
  { label: "¿Quiénes somos?", href: "/inicio#quienes-somos", type: NavItemType.LINK },
  // Página pública de la galería histórica (src/app/(public)/historia/page.tsx).
  { label: "Historia", href: "/historia", type: NavItemType.LINK },
  { label: "Programación", href: "/programacion", type: NavItemType.LINK },
  { label: "Donar", href: "/donar", type: NavItemType.LINK },
  { label: "Contacto", href: "/contacto", type: NavItemType.LINK },
  { label: "Login", type: NavItemType.LOGIN },
];

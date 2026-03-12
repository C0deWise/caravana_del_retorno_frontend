import { NavItem, NavItemType } from "@/types/navbar.types";

export const homeNavItems: NavItem[] = [
  { label: "¿Quiénes somos?", href: "/", type: NavItemType.LINK },
  { label: "Historia", href: "/", type: NavItemType.LINK },
  { label: "Programación", href: "/", type: NavItemType.LINK },
  { label: "Donar", href: "/", type: NavItemType.LINK },
  { label: "Contacto", href: "/", type: NavItemType.LINK },
  { label: "Login", type: NavItemType.LOGIN },
];

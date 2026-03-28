export const NavItemType = {
  LINK: "Link",
  DROPDOWN: "Menu desplegable",
  LOGIN: "Menu desplegable de inicio de sesión",
} as const;

export type NavType = (typeof NavItemType)[keyof typeof NavItemType];

export const NavTypeOptions = Object.values(NavItemType).map((value) => ({
  value,
  label: value,
}));

interface BaseNavItem {
  label: string;
  type: NavType;
}

export interface NavLinkItem extends BaseNavItem {
  type: typeof NavItemType.LINK;
  href: string;
}

export interface NavDropdownItem extends BaseNavItem {
  type: typeof NavItemType.DROPDOWN;
  items: { label: string; href: string }[];
}

export interface NavLoginItem extends BaseNavItem {
  type: typeof NavItemType.LOGIN;
}

export type NavItem = NavLinkItem | NavDropdownItem | NavLoginItem;

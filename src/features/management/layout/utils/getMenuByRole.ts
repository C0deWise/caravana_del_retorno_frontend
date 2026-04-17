import { menuConfig } from "../config/menu.config";
import { rolePermissions } from "../config/rolePermissions.config";
import { MenuItem } from "@/features/management/layout/types/menu.types";
import { UserRole } from "@/types/user.types";

export function getMenuByRole(role: UserRole | undefined): MenuItem[] {
  if (!role) return [];

  const allowedRoutes = rolePermissions[role] ?? [];

  return menuConfig
    .map((item) => ({
      ...item,
      subitems:
        item.subitems?.filter((sub) => allowedRoutes.includes(sub.href)) ?? [],
    }))
    .filter((item) => item.subitems && item.subitems.length > 0);
}

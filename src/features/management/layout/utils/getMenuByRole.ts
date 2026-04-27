import { menuConfig } from "../config/menu.config";
import { rolePermissions } from "../config/rolePermissions.config";
import { MenuItem } from "@/features/management/layout/types/menu.types";
import { UserData } from "@/types/user.types";

export function getMenuByRole(user: UserData | null | undefined): MenuItem[] {
  if (!user || !user.role) return [];

  const allowedRoutes = rolePermissions[user.role] ?? [];

  return menuConfig
    .map((item) => {
      let subitems =
        item.subitems?.filter((sub) => allowedRoutes.includes(sub.href)) ?? [];

      if (user.codigo_colonia === null || user.codigo_colonia === undefined) {
        subitems = subitems.filter(
          (sub) => sub.href !== "/gestion/colonia/miembros"
        );
      }

      return {
        ...item,
        subitems,
      };
    })
    .filter((item) => item.subitems && item.subitems.length > 0);
}

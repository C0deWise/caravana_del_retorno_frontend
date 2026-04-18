import type { UserRole } from "@/types/user.types";
import { ColonyMember } from "../types/colony-members.types";

export const getVisibleMemberData = (
  member: ColonyMember,
  loggedUserRole: UserRole,
): Partial<ColonyMember> => {
  switch (loggedUserRole) {
    case "usuario":
      return {
        nombre: `${member.nombre.split(" ")[0]}...`,
        apellido: `${member.apellido.split(" ")[0]}...`,
        role: member.role,
        correo: member.correo,
      };
    case "lider_colonia":
    case "admin":
    default:
      return member;
  }
};

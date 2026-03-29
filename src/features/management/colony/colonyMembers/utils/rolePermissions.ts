import type { UserRole } from "@/types/user.types";
import { Member } from "../types/member.types";

export const getVisibleMemberData = (
  member: Member,
  loggedUserRole: UserRole,
): Partial<Member> => {
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

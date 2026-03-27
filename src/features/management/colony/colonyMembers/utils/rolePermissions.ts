import type { LoggedUserRole } from "@/features/auth/types/roles";
import { Member } from "../types/member";

export const getVisibleMemberData = (
  member: Member,
  loggedUserRole: LoggedUserRole,
): Partial<Member> => {
  switch (loggedUserRole) {
    case "usuario":
      return {
        firstName: `${member.firstName.split(" ")[0]}...`,
        lastName: `${member.lastName.split(" ")[0]}...`,
        role: member.role,
        email: member.email,
      };
    case "lider_colonia":
    case "admin":
    default:
      return member;
  }
};

import { Member } from "../types/member";

export type LoggedUserRole = "usuario" | "lider_colonia" | "admin";

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
        phone: member.phone,
      };
    case "lider_colonia":
    case "admin":
    default:
      return member;
  }
};

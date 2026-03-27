import { LoggedUserRole } from "./roles";

export interface AuthUser {
  id: number;
  documentNumber: string;
  documentType: string;
  firstName: string;
  lastName: string;
  gender: "M" | "F" | "O";
  birthDate: string;
  phone: string;
  email: string;
  role: LoggedUserRole;
  colonyId: number | null;
}

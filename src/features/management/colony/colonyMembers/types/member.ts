import { AuthUser } from "@/features/auth/types/user";

export type Member = Pick<
  AuthUser,
  | "id"
  | "documentNumber"
  | "documentType"
  | "firstName"
  | "lastName"
  | "gender"
  | "birthDate"
  | "phone"
  | "email"
  | "role"
  | "colonyId"
>;

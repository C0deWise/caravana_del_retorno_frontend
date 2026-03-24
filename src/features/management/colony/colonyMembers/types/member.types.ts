import { UserData } from "@/types/user.types";

export type Member = Pick<
  UserData,
  | "id"
  | "documentNumber"
  | "documentType"
  | "firstName"
  | "lastName"
  | "gender"
  | "birthDate"
  | "phone"
  | "role"
  | "colonyId"
>;

export type UserGender = "M" | "F" | "O";
export type UserRole = "usuario" | "lider_colonia" | "admin";

export interface UserData {
  id: number;
  documentNumber: string;
  documentType: string;
  firstName: string;
  lastName: string;
  gender: UserGender;
  birthDate: string;
  phone: string;
  email: string | null;
  role: UserRole;
  country: string;
  department: string | null;
  city: string | null;
  colonyId: number | null;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: UserData | null;
}
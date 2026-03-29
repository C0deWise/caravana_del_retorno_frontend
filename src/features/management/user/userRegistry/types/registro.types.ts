import { UserApi } from "@/types/user.types";

export interface RegistrationData extends UserApi {
  password: string;
  confirmEmail: string;
  confirmPassword: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface DocumentValidationResponse {
  valido: boolean;
  mensaje: string;
}

import type { UserApi } from "@/types/user.types";

export type RegistrationRequest = Pick<
  UserApi,
  | "tipo_doc"
  | "documento"
  | "celular"
  | "correo"
  | "nombre"
  | "apellido"
  | "genero"
  | "fecha_nacimiento"
  | "pais"
  | "departamento"
  | "ciudad"
> & {
  contrasenia: string;
};

export type RegistrationFormData = RegistrationRequest & {
  confirmEmail: string;
  confirmPassword: string;
};

export interface RegistrationResponse {
  mensaje: string;
  nombre: string;
}

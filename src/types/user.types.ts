export type UserDocumentType = "CC" | "CE";
export type UserGender = "M" | "F" | "otro";
export type UserRole = "usuario" | "lider_colonia" | "admin";
type userCodeRole = 1 | 2 | 3;

export const ROLE_TO_CODE: Record<UserRole, userCodeRole> = {
  usuario: 1,
  lider_colonia: 2,
  admin: 3,
};

export const CODE_TO_ROLE: Record<userCodeRole, UserRole> = {
  1: "usuario",
  2: "lider_colonia",
  3: "admin",
};

export interface UserApi {
  id: number;
  fecha_creacion: string;
  tipo_doc: string;
  documento: string;
  celular: string;
  correo: string;
  codigo_colonia: number | null;
  codigo_rol: userCodeRole;
  nombre: string;
  apellido: string;
  genero: UserGender;
  fecha_nacimiento: string;
  pais: string;
  departamento: string | null;
  ciudad: string | null;
}

export type UserData = Omit<UserApi, "codigo_rol"> & { role: UserRole };

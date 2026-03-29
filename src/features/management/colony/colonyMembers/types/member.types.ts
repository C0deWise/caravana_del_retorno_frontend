import { UserData } from "@/types/user.types";

export type Member = Pick<
  UserData,
  | "id"
  | "documento"
  | "tipo_doc"
  | "nombre"
  | "apellido"
  | "genero"
  | "fecha_nacimiento"
  | "celular"
  | "correo"
  | "role"
  | "codigo_colonia"
>;

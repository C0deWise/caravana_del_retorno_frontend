export type UserDocumentType = "CC" | "CE";
export type UserGender = "M" | "F" | "otro";
export type UserRole = "usuario" | "lider_colonia" | "admin" | "Invitado";
type userCodeRole = 1 | 2 | 3;

export const ROLE_TO_CODE: Record<Exclude<UserRole, "Invitado">, userCodeRole> = {
  usuario: 1,
  lider_colonia: 2,
  admin: 3,
};

const ROLES_MAP: Record<number, UserRole> = {
  1: "usuario",
  2: "lider_colonia",
  3: "admin",
};

export const CODE_TO_ROLE = new Proxy(ROLES_MAP, {
  get: (target, prop) => {
    if (typeof prop === "symbol") return target[prop as unknown as number];
    
    const key = Number.parseInt(prop, 10);
    if (Number.isNaN(key)) return target[prop as unknown as number];

    return target[key] || "Invitado";
  },
});

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

// Search Types
export type UserSearchResult = UserApi;
export const USER_SEARCH_MODES = ["general", "nombre", "documento"] as const;
export type UserSearchMode = (typeof USER_SEARCH_MODES)[number];

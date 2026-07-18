/**
 * Definiciones de tipos y esquemas de datos para el módulo de Usuarios.
 * Proporciona interfaces para la API, tipos de utilidad para roles, 
 * y mecanismos de mapeo para asegurar la consistencia del sistema.
 */

// --- Tipos de enumeración básicos ---
export type UserDocumentType = "CC" | "CE";
export type UserGender = "M" | "F" | "otro";
export type UserRole = "usuario" | "lider_colonia" | "admin" | "invitado";
type userCodeRole = 1 | 2 | 3 | 4;

/**
 * Mapeo estático de roles a sus respectivos códigos numéricos.
 * Se excluye "invitado" ya que no posee un código de rol asignado
 *  en la persistencia.
 * Se usa para representar a usuarios que no han iniciado sesión o
 *  cuyo token no contiene un rol válido. :3
 */
export const ROLE_TO_CODE: Record<Exclude<UserRole, "invitado">, userCodeRole> = {
  usuario: 1,
  lider_colonia: 2,
  admin: 3,
};

// Diccionario interno para la resolución de roles
const ROLES_MAP: Record<number, UserRole> = {
  1: "usuario",
  2: "lider_colonia",
  3: "admin",
  4: "invitado",
};

/**
 * Proxy para la resolución segura de roles desde el código numérico.
 * Garantiza que si un código no existe, el sistema asuma el rol por defecto "invitado".
 */
export const CODE_TO_ROLE = new Proxy(ROLES_MAP, {
  get: (target, prop) => {
    // Si la propiedad es un símbolo, retorna el valor mapeado directamente
    if (typeof prop === "symbol") return target[prop as unknown as number];
    
    // Intenta convertir la prop a entero para la búsqueda
    const key = Number.parseInt(prop, 10);
    
    // Si la conversión falla (no es número), intenta buscar por clave directa
    if (Number.isNaN(key)) return target[prop as unknown as number];

    // Retorna el rol encontrado o el fallback a "invitado"
    return target[key] || "invitado";
  },
});

/**
 * Interfaz de la entidad Usuario tal como se recibe de la API/Base de datos.
 */
export interface UserApi {
  id: number;
  fecha_creacion: string; // Formato ISO 8601
  tipo_doc: string;
  documento: string;
  celular: string;
  correo: string;
  codigo_colonia: number | null;
  codigo_retorno: number | null;
  codigo_rol: userCodeRole; // Código crudo para persistencia
  nombre: string;
  apellido: string;
  genero: UserGender;
  fecha_nacimiento: string;
  pais: string;
  departamento: string | null;
  ciudad: string | null;
  google_email?: string | null;
}

/**
 * Interfaz transformada uwu para uso en el Frontend/Logica de negocio.
 * Reemplaza el código numérico 'codigo_rol' por el tipo legible 'role'.
 */
export type UserData = Omit<UserApi, "codigo_rol"> & { role: UserRole };

// --- Configuración de búsqueda ---
export type UserSearchResult = UserApi;
export const USER_SEARCH_MODES = ["general", "nombre", "documento"] as const;
export type UserSearchMode = (typeof USER_SEARCH_MODES)[number];
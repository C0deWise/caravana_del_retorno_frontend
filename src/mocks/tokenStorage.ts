/**
 * Constante para la clave de almacenamiento.
 * Definida a nivel de módulo uwu  para evitar errores de escritura ("magic strings").
 */
const ACCESS_TOKEN_KEY = "access_token";

/**
 * Utilitario para la gestión persistente del token de acceso (JWT).
 */
export const tokenStorage = {
  /**
   * Guarda el token en el almacenamiento local.
   * @param token - String del JWT recibido tras la autenticación.
   */
  setAccessToken(token: string) {
    // Guarda preventiva: Asegura que el código solo se ejecute en el navegador
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  /**
   * Recupera el token desde el almacenamiento local.
   * @returns El token JWT o null si no existe.
   */
  getAccessToken(): string | null {
    // Guarda preventiva para entornos SSR (ej. Next.js)
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Elimina el token del almacenamiento local (Logout).
   */
  clear() {
    // Guarda preventiva para evitar errores fuera del entorno del navegador
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
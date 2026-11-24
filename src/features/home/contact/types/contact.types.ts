/** Color de acento de una tarjeta (tokens de `globals.css`). */
export type ContactAccent = "secondary" | "accent-green" | "accent-yellow" | "accent-red" | "primary";

/**
 * Persona o equipo de contacto de la página pública "Contacto".
 * `name`, `email` y `photo` son `null` mientras no estén confirmados: la tarjeta
 * solo muestra lo que existe (nunca se inventan datos).
 */
export interface ContactPerson {
  key: string;
  /** Cargo / rol (p. ej. "Presidenta"). */
  role: string;
  /** Ámbito del rol (p. ej. "Colonia Cali"). */
  scope: string;
  name: string | null;
  description: string;
  email: string | null;
  /**
   * Foto de la persona (ruta en `public/contacto/`, p. ej. "/contacto/foto-presidenta.jpeg").
   * `null` mientras no haya foto: el círculo muestra las iniciales o un ícono.
   */
  photo: string | null;
  accent: ContactAccent;
}

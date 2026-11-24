/**
 * Tipos de la landing pública (Inicio + "¿Quiénes somos?").
 *
 * Todo lo que es dato del negocio (colonias, retornos, publicaciones)
 * viene del backend. Aquí solo se tipan las respuestas y el estado que
 * consume la UI; ningún valor numérico se define en el frontend.
 */

/**
 * Colonia tal como la devuelve `GET /api/v1/colonias/publicas/` (ColoniaPublica).
 * Endpoint público: solo ubicación, sin líder ni estado (todas son activas).
 */
export interface PublicColonyApi {
  codigo: number;
  pais: string;
  departamento: string | null;
  ciudad: string | null;
}

/** Publicación según `GET /api/v1/publicacion/obtener-publicaciones-retorno/{id}/`. Solo se usa para contar. */
export interface PublicPublicationApi {
  codigo: number;
  retorno: number;
}

/**
 * Indicador mostrado en el panel de cifras.
 * `value` es `null` cuando el backend no respondió: en ese caso el
 * indicador no se renderiza (nunca se muestra un número inventado).
 */
export interface LandingIndicator {
  key: "colonias" | "retornos" | "publicaciones";
  label: string;
  value: number | null;
}

/** Estado agregado que expone `useLandingData`. */
export interface LandingData {
  colonies: PublicColonyApi[] | null;
  finishedReturns: number | null;
  publications: number | null;
}

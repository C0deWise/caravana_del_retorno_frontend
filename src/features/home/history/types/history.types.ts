/**
 * Tipos de la sección "Historia" (galería por Retorno).
 *
 * Las respuestas reflejan los esquemas del backend:
 *  - `RetornoResponse`        → GET /api/v1/retornos/
 *  - `PublicacionRespuesta`   → GET /api/v1/obtener-publicaciones-retorno/{id}/
 *  - `MultimediaRespuesta`    → elementos de `multimedia_lista`
 */

export type ReturnState = "activo" | "en_curso" | "finalizado";
export type MediaType = "imagen" | "video" | "documento";
export type MediaFormat =
  | "jpg"
  | "jpeg"
  | "png"
  | "gif"
  | "mp4"
  | "avi"
  | "mov"
  | "mkv"
  | "pdf"
  | "embed";

export interface ReturnApi {
  codigo: number;
  fecha_creacion: string;
  anio: number;
  estado: ReturnState;
}

export interface MediaApi {
  codigo: number;
  publicacion: number;
  tipo: MediaType;
  formato: MediaFormat;
  /** URL pública del archivo (Supabase Storage) o del video embebido. */
  url: string;
  descripcion: string;
}

export interface PublicationApi {
  codigo: number;
  retorno: number;
  autor: number;
  nombre_autor: string | null;
  titulo: string;
  resena: string;
  fecha_creacion: string;
  multimedia_lista: MediaApi[];
}

/**
 * Elemento de la galería (un archivo de una publicación), normalizado para la UI.
 */
export interface GalleryItem {
  key: string;
  returnCode: number;
  year: number;
  kind: "imagen" | "video" | "embed" | "documento";
  /** URL pública del archivo. */
  src: string;
  /** Miniatura a usar en la tarjeta (para embeds de YouTube). */
  thumbnail?: string;
  description?: string;
  publication: Omit<PublicationApi, "multimedia_lista"> & {
    mediaCount: number;
  };
}

/** Un Retorno con su galería, listo para renderizar. */
export interface ReturnGroup {
  code: number;
  year: number;
  state: ReturnState;
  publicationsCount: number;
  items: GalleryItem[];
  /** Color propio del Retorno (línea del tiempo y encabezado), por orden cronológico. */
  color: string;
}

/** Filtro de tipo de contenido. */
export type MediaFilter = "todo" | "fotos" | "videos";

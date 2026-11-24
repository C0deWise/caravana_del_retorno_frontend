import type { GalleryItem, MediaApi } from "../types/history.types";

/**
 * Extrae el ID de un video de YouTube a partir de sus formatos de URL
 * habituales (watch?v=, youtu.be/, /embed/, /shorts/). `null` si no aplica.
 */
export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

/** Clasifica un archivo del backend en el tipo de tarjeta que se debe mostrar. */
export function mediaKind(media: MediaApi): GalleryItem["kind"] {
  if (media.formato === "embed") return "embed";
  if (media.tipo === "video") return "video";
  if (media.tipo === "documento") return "documento";
  return "imagen";
}

/** URL de embed (modo privacidad) para un video embebido; `null` si no es de YouTube. */
export function embedUrl(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
}

/** Miniatura pública de YouTube para mostrar en la tarjeta. */
export function youTubeThumbnail(url: string): string | undefined {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
}

/** Fecha legible en español de Colombia, p. ej. "7 ene 2017". */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "1 publicación" / "3 publicaciones". */
export const pluralize = (n: number, singular: string, plural: string) =>
  `${n} ${n === 1 ? singular : plural}`;

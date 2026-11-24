import type { ReturnState } from "../types/history.types";

/**
 * Contenido estático de la sección "Historia" (textos del prototipo de Figma).
 * Los datos (años, publicaciones, fotos y videos) vienen del backend.
 */

export const HISTORY_COPY = {
  eyebrow: "Historia",
  title: "Nuestra memoria compartida",
  body: "Fotografías, videos y testimonios de cada Retorno. Recorre la línea del tiempo o filtra por año para revivir los reencuentros.",
  filterLabel: "Filtrar por Retorno",
  allLabel: "Todos",
  viewAll: "Ver todo",
  showLess: "Ver menos",
  empty: {
    title: "Aún no hay imágenes de este Retorno.",
    body: "Cuando las colonias publiquen fotos y videos, aparecerán aquí.",
    cta: { label: "Compartir un recuerdo", href: "/gestion" },
  },
  noReturns: "Aún no hay Retornos registrados.",
  loadError: "No pudimos cargar la historia en este momento. Intenta de nuevo más tarde.",
};

/** Etiqueta visible del estado de un Retorno (badge y timeline). */
export const RETURN_STATE_LABEL: Record<ReturnState, string> = {
  finalizado: "Realizado",
  en_curso: "En curso",
  activo: "Próximo",
};

/** Elementos visibles por grupo antes de "Ver todo". */
export const ITEMS_PREVIEW = 8;

/**
 * Paleta de la línea del tiempo: un color por Retorno, pensada para 19
 * Retornos. Recorre la gama institucional (naranja → amarillo → verde →
 * azul → rojo) en tonos distinguibles entre sí. Se asigna por orden
 * cronológico (el más antiguo toma el primero); si algún día hay más de 19,
 * la paleta vuelve a empezar.
 */
export const RETURN_COLORS: readonly string[] = [
  "#f28f38", // naranja institucional
  "#f5a524",
  "#eabe03", // amarillo institucional
  "#c9b400",
  "#9bb81f",
  "#5aa83a",
  "#038c4a", // verde institucional
  "#0a7d6b",
  "#0f8a99",
  "#1f74b8",
  "#024059", // azul institucional
  "#3d5aa8",
  "#6a4fa3",
  "#93449a",
  "#b8407e",
  "#d63a5e",
  "#ec1e25", // rojo institucional
  "#c4441f",
  "#a85a2a",
];

/** Color de un Retorno según su posición cronológica (0 = el más antiguo). */
export const returnColor = (chronologicalIndex: number) =>
  RETURN_COLORS[chronologicalIndex % RETURN_COLORS.length];

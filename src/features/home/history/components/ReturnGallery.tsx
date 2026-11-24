"use client";

/* eslint-disable @next/next/no-img-element -- Las imágenes vienen de Supabase/YouTube (dominios externos
   no configurados en next/image) y en tamaños arbitrarios; se usa <img> con lazy-loading nativo. */

import Image from "next/image";
import Link from "next/link";
import {
  HISTORY_COPY,
  ITEMS_PREVIEW,
  RETURN_STATE_LABEL,
} from "../config/history.config";
import type { GalleryItem, ReturnGroup } from "../types/history.types";
import { formatDate, pluralize } from "../utils/media";

/** Color del badge por estado del Retorno (prototipo "Encabezado Retorno"). */
const STATE_BADGE: Record<ReturnGroup["state"], string> = {
  finalizado: "bg-accent-green/18 [&>i]:bg-accent-green",
  en_curso: "bg-accent-yellow/25 [&>i]:bg-accent-yellow",
  activo: "bg-secondary/20 [&>i]:bg-secondary",
};

/**
 * Bloque de un Retorno: encabezado + galería tipo masonry (o estado vacío).
 * `items` ya llega filtrado por tipo (fotos/videos) desde la sección.
 */
export default function ReturnGallery({
  group,
  items,
  expanded,
  onToggleExpanded,
  onOpen,
}: {
  group: ReturnGroup;
  items: GalleryItem[];
  expanded: boolean;
  onToggleExpanded: () => void;
  onOpen: (item: GalleryItem) => void;
}) {
  const visible = expanded ? items : items.slice(0, ITEMS_PREVIEW);
  const canExpand = items.length > ITEMS_PREVIEW;

  return (
    <section
      id={`retorno-${group.year}`}
      aria-labelledby={`retorno-${group.year}-title`}
      className="flex scroll-mt-64 flex-col gap-6"
    >
      {/* Encabezado del Retorno */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-bg-separator pb-4">
        <div className="flex items-center gap-4">
          {/* Barra con el color propio del Retorno (el mismo de la línea del tiempo). */}
          <span aria-hidden className="h-14 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: group.color }} />
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3
                id={`retorno-${group.year}-title`}
                className="text-2xl font-bold leading-tight text-primary"
              >
                Retorno {group.year}
              </h3>
              <span
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-primary ${STATE_BADGE[group.state]}`}
              >
                <i aria-hidden className="size-2 rounded-full" />
                {RETURN_STATE_LABEL[group.state]}
              </span>
            </div>
            <p className="text-sm text-text-muted">
              {pluralize(group.publicationsCount, "publicación", "publicaciones")}
            </p>
          </div>
        </div>

        {canExpand && (
          <button
            type="button"
            onClick={onToggleExpanded}
            aria-expanded={expanded}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {expanded ? HISTORY_COPY.showLess : HISTORY_COPY.viewAll}
            <Image
              src="/home/icons/flecha-ver-todo.svg"
              alt=""
              width={16}
              height={16}
              className={expanded ? "-rotate-90" : ""}
            />
          </button>
        )}
      </header>

      {visible.length === 0 ? (
        group.items.length > 0 ? (
          // Hay contenido, pero no del tipo filtrado (p. ej. "Videos").
          <p className="rounded-xl border border-dashed border-bg-border px-5 py-4 text-sm text-text-muted">
            No hay contenido de este tipo en el Retorno {group.year}.
          </p>
        ) : (
          <EmptyReturn />
        )
      ) : (
        // Masonry con columnas CSS: respeta la proporción real de cada foto.
        <ul className="columns-2 gap-4 md:columns-3 lg:columns-4 lg:gap-6">
          {visible.map((item) => (
            <li key={item.key} className="mb-4 break-inside-avoid lg:mb-6">
              <MediaCard item={item} onOpen={() => onOpen(item)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * Tarjeta de la galería (prototipo "Tarjeta Multimedia").
 * Hover/foco: velo azul con título, autor y fecha de la publicación.
 * Video/embed: ícono de play.
 */
function MediaCard({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const pub = item.publication;
  const label = pub.titulo || `Contenido del Retorno ${item.year}`;
  const meta = [pub.nombre_autor, formatDate(pub.fecha_creacion)].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ver ${label}`}
      className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl bg-bg-card text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    >
      <CardPreview item={item} />

      {(item.kind === "video" || item.kind === "embed") && (
        <>
          <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,26,38,0.6))]" />
          <Image
            src="/home/icons/play.svg"
            alt=""
            width={60}
            height={60}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </>
      )}

      {/* Velo con información de la publicación. */}
      <span className="absolute inset-0 flex flex-col justify-end gap-1.5 bg-primary/80 p-4 text-text-inverse opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Image
            src="/home/icons/expandir.svg"
            alt=""
            width={32}
            height={32}
            className="absolute right-4 top-4 rounded-full bg-text-inverse/15 p-2"
          />
          <span className="line-clamp-3 text-lg font-semibold leading-snug">{pub.titulo}</span>
          {meta && <span className="text-xs font-medium">{meta}</span>}
        </span>
    </button>
  );
}

/** Vista previa del archivo dentro de la tarjeta según su tipo. */
function CardPreview({ item }: { item: GalleryItem }) {
  if (item.kind === "video") {
    // `#t=0.1` fuerza al navegador a mostrar un fotograma como portada.
    return (
      <video
        src={`${item.src}#t=0.1`}
        preload="metadata"
        muted
        playsInline
        className="block aspect-[4/5] w-full object-cover"
      />
    );
  }
  if (item.kind === "embed") {
    return item.thumbnail ? (
      <img src={item.thumbnail} alt="" loading="lazy" className="block aspect-video w-full object-cover" />
    ) : (
      <span className="flex aspect-video w-full items-center justify-center bg-primary text-sm text-text-inverse">
        Video
      </span>
    );
  }
  if (item.kind === "documento") {
    return (
      <span className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 bg-bg-card text-primary">
        <span className="rounded-lg border-2 border-primary px-3 py-2 text-sm font-bold">PDF</span>
        <span className="text-xs text-text-muted">Documento</span>
      </span>
    );
  }
  return (
    <img
      src={item.src}
      alt={item.description ?? item.publication.titulo}
      loading="lazy"
      className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
}

/** Estado vacío del prototipo: Retorno sin publicaciones. */
function EmptyReturn() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-bg-border bg-bg-card px-6 py-14 text-center">
      <Image src="/home/icons/vacio-ilustracion.svg" alt="" width={120} height={96} />
      <p className="text-lg font-semibold text-primary">{HISTORY_COPY.empty.title}</p>
      <p className="text-base text-text-muted">{HISTORY_COPY.empty.body}</p>
      <Link
        href={HISTORY_COPY.empty.cta.href}
        className="flex items-center gap-2 rounded-full border-[1.5px] border-primary px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
      >
        {HISTORY_COPY.empty.cta.label}
        <Image src="/home/icons/flecha-outline.svg" alt="" width={18} height={18} />
      </Link>
    </div>
  );
}

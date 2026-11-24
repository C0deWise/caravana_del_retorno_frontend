"use client";

/* eslint-disable @next/next/no-img-element -- Archivos de Supabase/YouTube (dominios externos). */

import { useEffect, useRef } from "react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentIcon,
  PhotoIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import InstitutionalStripe from "@/ui/decorators/InstitutionalStripe";
import type { GalleryItem } from "../types/history.types";
import { embedUrl, formatDate, pluralize } from "../utils/media";

/**
 * Visor a pantalla completa (prototipo "Lightbox").
 *
 * - Izquierda: el archivo (foto, video, video embebido o documento).
 * - Derecha: la información pública de la publicación — Retorno, título,
 *   reseña, autor, fecha, número de archivos y descripción del archivo.
 *   Solo se muestran los campos que la publicación trae.
 * - Abajo: "Contenido relacionado" (otros archivos del mismo Retorno).
 * - Teclado: Esc cierra, ←/→ navegan. Bloquea el scroll de la página.
 */
export default function HistoryLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  /** Lista navegable (lo visible con los filtros actuales). */
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const item = items[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = items.length;

  const prev = () => onNavigate((index - 1 + total) % total);
  const next = () => onNavigate((index + 1) % total);

  // Teclado + bloqueo de scroll + foco inicial en "cerrar".
  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate((index - 1 + total) % total);
      if (e.key === "ArrowRight") onNavigate((index + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total, onClose, onNavigate]);

  if (!item) return null;

  // Relacionados: otros archivos del mismo Retorno dentro de la lista visible.
  const related = items
    .map((it, i) => ({ it, i }))
    .filter(({ it }) => it.returnCode === item.returnCode);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Contenido del Retorno ${item.year}`}
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-primary text-text-inverse"
    >
      {/* Barra superior: contador + cerrar */}
      <div className="flex items-center justify-between px-4 py-4 md:px-10">
        <p className="flex items-center gap-3 text-sm font-semibold">
          <InstitutionalStripe className="h-1.5 w-10" />
          {index + 1} / {total}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-text-inverse text-primary transition-transform hover:scale-105"
        >
          <XMarkIcon className="size-6" />
        </button>
      </div>

      {/* Cuerpo: archivo + información */}
      <div className="flex flex-1 flex-col gap-6 px-4 md:px-10 lg:flex-row lg:items-center lg:gap-10">
        <div className="relative flex flex-1 items-center justify-center gap-3 md:gap-6">
          <NavButton direction="prev" onClick={prev} hidden={total < 2} />
          <div className="flex max-h-[70vh] min-h-[240px] w-full flex-1 items-center justify-center overflow-hidden rounded-xl">
            <MediaViewer key={item.key} item={item} />
          </div>
          <NavButton direction="next" onClick={next} hidden={total < 2} />
        </div>

        <InfoPanel item={item} />
      </div>

      {/* Contenido relacionado */}
      {related.length > 1 && (
        <div className="px-4 pb-6 pt-6 md:px-10">
          <p className="mb-2 text-sm font-semibold">Contenido relacionado</p>
          <ul className="flex gap-3 overflow-x-auto pb-1">
            {related.map(({ it, i }) => (
              <li key={it.key} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate(i)}
                  aria-label={`Ver elemento ${i + 1}`}
                  aria-current={i === index}
                  className={`block h-[72px] w-[104px] cursor-pointer overflow-hidden rounded-lg border-[3px] ${
                    i === index ? "border-secondary" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <Thumb item={it} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Renderiza el archivo en grande según su tipo. */
function MediaViewer({ item }: { item: GalleryItem }) {
  if (item.kind === "video") {
    return (
      <video src={item.src} controls playsInline className="max-h-[70vh] w-full rounded-xl bg-black">
        {/* Las publicaciones aún no tienen subtítulos; la pista vacía deja lista la estructura accesible. */}
        <track kind="captions" />
      </video>
    );
  }
  if (item.kind === "embed") {
    const src = embedUrl(item.src);
    return src ? (
      <div className="aspect-video w-full">
        <iframe
          src={src}
          title={item.publication.titulo || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="size-full rounded-xl border-0"
        />
      </div>
    ) : (
      <ExternalLink href={item.src} label="Abrir video" />
    );
  }
  if (item.kind === "documento") {
    return <ExternalLink href={item.src} label="Abrir documento" />;
  }
  return (
    <img
      src={item.src}
      alt={item.description ?? item.publication.titulo}
      className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain"
    />
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-sm font-semibold text-primary"
    >
      <DocumentIcon className="size-5" />
      {label}
    </a>
  );
}

/** Tarjeta blanca con la información pública de la publicación. */
function InfoPanel({ item }: { item: GalleryItem }) {
  const pub = item.publication;

  return (
    <aside className="flex w-full flex-col gap-5 rounded-xl bg-bg p-6 text-text lg:w-[380px] lg:shrink-0">
      <span className="flex w-fit items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
        <CalendarIcon className="size-4" />
        Retorno {item.year}
      </span>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold leading-snug text-primary">{pub.titulo}</h2>
            {pub.resena && (
              <p className="max-h-48 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-text">
                {pub.resena}
              </p>
            )}
          </div>

          <dl className="flex flex-col gap-3 border-t border-bg-separator pt-4 text-sm">
            {pub.nombre_autor && (
              <InfoRow icon={<UserIcon className="size-5" />} label="Publicado por" value={pub.nombre_autor} />
            )}
            {formatDate(pub.fecha_creacion) && (
              <InfoRow
                icon={<CalendarIcon className="size-5" />}
                label="Fecha de publicación"
                value={formatDate(pub.fecha_creacion)}
              />
            )}
            <InfoRow
              icon={<PhotoIcon className="size-5" />}
              label="En esta publicación"
              value={pluralize(pub.mediaCount, "archivo", "archivos")}
            />
          </dl>

          {item.description && (
            <p className="rounded-lg bg-bg-card p-3 text-sm text-text-muted">{item.description}</p>
          )}
    </aside>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-secondary">{icon}</span>
      <div>
        <dt className="text-xs text-text-muted">{label}</dt>
        <dd className="font-medium text-text">{value}</dd>
      </div>
    </div>
  );
}

/** Miniatura del carrusel "Contenido relacionado". */
function Thumb({ item }: { item: GalleryItem }) {
  if (item.kind === "imagen") {
    return <img src={item.src} alt="" loading="lazy" className="size-full object-cover" />;
  }
  if (item.kind === "embed" && item.thumbnail) {
    return <img src={item.thumbnail} alt="" loading="lazy" className="size-full object-cover" />;
  }
  if (item.kind === "video") {
    return <video src={`${item.src}#t=0.1`} preload="metadata" muted className="size-full object-cover" />;
  }
  return (
    <span className="flex size-full items-center justify-center bg-bg-card text-xs font-bold text-primary">PDF</span>
  );
}

/** Flecha circular de navegación. */
function NavButton({
  direction,
  onClick,
  hidden,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  hidden: boolean;
}) {
  if (hidden) return null;
  const Icon = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Anterior" : "Siguiente"}
      className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-text-inverse text-primary transition-transform hover:scale-105 md:size-14"
    >
      <Icon className="size-6" />
    </button>
  );
}

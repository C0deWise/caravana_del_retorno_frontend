"use client";

import { useCallback, useMemo, useState } from "react";
import InstitutionalStripe from "@/ui/decorators/InstitutionalStripe";
import HistoryTimeline from "./HistoryTimeline";
import HistoryFilters from "./HistoryFilters";
import ReturnGallery from "./ReturnGallery";
import HistoryLightbox from "./HistoryLightbox";
import { useHistory } from "../hooks/useHistory";
import { HISTORY_COPY } from "../config/history.config";
import type { GalleryItem, MediaFilter } from "../types/history.types";

/** ¿El elemento pasa el filtro de tipo de contenido? */
const matchesMedia = (item: GalleryItem, filter: MediaFilter) =>
  filter === "todo" ||
  (filter === "fotos" && item.kind === "imagen") ||
  (filter === "videos" && (item.kind === "video" || item.kind === "embed"));

/**
 * Página "Historia" (prototipo "Sección · Historia").
 *
 * Orquesta los datos del backend (`useHistory`) y el estado de UI:
 * año seleccionado (timeline + chips), tipo de contenido, grupos
 * expandidos y el elemento abierto en el lightbox.
 */
export default function HistorySection() {
  const { groups, loading, error } = useHistory();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("todo");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Grupos visibles con sus elementos ya filtrados por tipo.
  const visibleGroups = useMemo(
    () =>
      groups
        .filter((g) => selectedYear === null || g.year === selectedYear)
        .map((g) => ({ group: g, items: g.items.filter((it) => matchesMedia(it, mediaFilter)) })),
    [groups, selectedYear, mediaFilter],
  );

  // Lista plana navegable por el lightbox (en el mismo orden que la página).
  const flatItems = useMemo(() => visibleGroups.flatMap((v) => v.items), [visibleGroups]);

  /** Selecciona un año desde el timeline y lleva la vista a su galería. */
  const selectFromTimeline = useCallback((year: number) => {
    setSelectedYear(year);
    requestAnimationFrame(() =>
      document.getElementById(`retorno-${year}`)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }, []);

  const toggleExpanded = (code: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });

  const openItem = (item: GalleryItem) => {
    const i = flatItems.findIndex((it) => it.key === item.key);
    if (i >= 0) setOpenIndex(i);
  };

  return (
    <section
      aria-labelledby="historia-title"
      className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 pb-24 pt-16 md:px-10 md:pt-24 xl:px-20"
    >
      {/* Encabezado */}
      <header className="flex flex-col gap-3">
        <p className="flex items-center gap-2.5 text-sm font-semibold text-primary">
          <InstitutionalStripe className="h-1.5 w-10" />
          {HISTORY_COPY.eyebrow}
        </p>
        <h1 id="historia-title" className="text-2xl font-bold leading-tight text-primary md:text-[30px]">
          {HISTORY_COPY.title}
        </h1>
        <p className="max-w-[720px] text-base text-text-muted">{HISTORY_COPY.body}</p>
      </header>

      {loading ? (
        <HistorySkeleton />
      ) : error ? (
        <p className="alert-error alert-error-text">{HISTORY_COPY.loadError}</p>
      ) : groups.length === 0 ? (
        <p className="rounded-xl border border-dashed border-bg-border px-5 py-4 text-sm text-text-muted">
          {HISTORY_COPY.noReturns}
        </p>
      ) : (
        <>
          <HistoryTimeline groups={groups} activeYear={selectedYear} onSelect={selectFromTimeline} />
          <HistoryFilters
            groups={groups}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            mediaFilter={mediaFilter}
            onMediaFilter={setMediaFilter}
          />
          <div className="flex flex-col gap-16">
            {visibleGroups.map(({ group, items }) => (
              <ReturnGallery
                key={group.code}
                group={group}
                items={items}
                expanded={expanded.has(group.code)}
                onToggleExpanded={() => toggleExpanded(group.code)}
                onOpen={openItem}
              />
            ))}
          </div>
        </>
      )}

      {openIndex !== null && flatItems[openIndex] && (
        <HistoryLightbox
          items={flatItems}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </section>
  );
}

/** Esqueleto neutro mientras responde el backend. */
function HistorySkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-8" aria-busy>
      <div className="h-20 rounded-xl bg-bg-card" />
      <div className="h-16 rounded-xl bg-bg-card" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-56 rounded-xl bg-bg-card" />
        ))}
      </div>
    </div>
  );
}

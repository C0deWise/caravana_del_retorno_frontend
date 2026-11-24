"use client";

import Image from "next/image";
import { HISTORY_COPY } from "../config/history.config";
import type { MediaFilter, ReturnGroup } from "../types/history.types";
import { pluralize } from "../utils/media";

const MEDIA_FILTERS: { value: MediaFilter; label: string }[] = [
  { value: "todo", label: "Todo" },
  { value: "fotos", label: "Fotos" },
  { value: "videos", label: "Videos" },
];

/**
 * Barra de filtros fija bajo el header (top 8.5rem = alto del header + su curva) (prototipo "Filtros (sticky)").
 * - Chips por año: "Todos" + un chip por Retorno con su número de publicaciones.
 * - A la derecha: total de publicaciones visibles y selector Todo/Fotos/Videos.
 * En móvil los chips se desplazan horizontalmente.
 */
export default function HistoryFilters({
  groups,
  selectedYear,
  onSelectYear,
  mediaFilter,
  onMediaFilter,
}: {
  groups: ReturnGroup[];
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
  mediaFilter: MediaFilter;
  onMediaFilter: (filter: MediaFilter) => void;
}) {
  const totalPublications = groups.reduce((sum, g) => sum + g.publicationsCount, 0);
  const visiblePublications =
    selectedYear === null
      ? totalPublications
      : (groups.find((g) => g.year === selectedYear)?.publicationsCount ?? 0);

  return (
    <div className="sticky top-[8.5rem] z-30 flex flex-col gap-3 rounded-[14px] border border-bg-border bg-bg/95 px-4 py-3.5 shadow-[0_6px_18px_rgba(3,38,56,0.08)] backdrop-blur-[5px] lg:flex-row lg:items-center lg:justify-between">
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        <span className="flex shrink-0 items-center gap-2 pr-1 text-sm font-semibold text-primary">
          <Image src="/home/icons/filtro.svg" alt="" width={18} height={18} />
          {HISTORY_COPY.filterLabel}
        </span>
        <Chip
          label={HISTORY_COPY.allLabel}
          count={totalPublications}
          active={selectedYear === null}
          onClick={() => onSelectYear(null)}
        />
        {groups.map((group) => (
          <Chip
            key={group.code}
            label={`Retorno ${group.year}`}
            count={group.publicationsCount}
            active={selectedYear === group.year}
            onClick={() => onSelectYear(group.year)}
          />
        ))}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 lg:justify-end">
        <p className="text-sm text-text-muted" aria-live="polite">
          {pluralize(visiblePublications, "publicación", "publicaciones")}
        </p>
        <div role="radiogroup" aria-label="Tipo de contenido" className="flex gap-1 rounded-full bg-bg-card p-1">
          {MEDIA_FILTERS.map((option) => {
            const active = mediaFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onMediaFilter(option.value)}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-bg text-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                    : "text-text-muted hover:text-primary"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Chip de filtro: activo en azul con texto blanco; inactivo con borde gris. */
function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-primary text-text-inverse"
          : "border border-bg-border bg-bg text-text hover:border-primary"
      }`}
    >
      {label}
      <span className={`text-xs font-medium ${active ? "text-text-inverse/85" : "text-text-muted"}`}>
        {count}
      </span>
    </button>
  );
}

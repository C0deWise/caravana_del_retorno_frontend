"use client";

import { RETURN_STATE_LABEL } from "../config/history.config";
import type { ReturnGroup } from "../types/history.types";

/**
 * Línea del tiempo de los Retornos (prototipo "Timeline").
 *
 * - Se construye 100 % con los Retornos del backend: al crear uno nuevo,
 *   aparece solo en su lugar (orden cronológico, del más antiguo al más reciente).
 * - Cada Retorno tiene su propio color (`group.color`, paleta de 19 en
 *   `RETURN_COLORS`): su tramo de la línea y el borde de su punto.
 * - Dimensionada para 19 hitos: una columna por Retorno (mín. 3.75rem, así
 *   19 caben en el ancho de diseño de 1280px);
 *   en pantallas grandes se reparten a lo ancho y en angostas se desplaza
 *   horizontalmente.
 * - Al hacer clic se filtra y se desplaza a la galería de ese Retorno.
 */
export default function HistoryTimeline({
  groups,
  activeYear,
  onSelect,
}: {
  groups: ReturnGroup[];
  activeYear: number | null;
  onSelect: (year: number) => void;
}) {
  const ordered = [...groups].sort((a, b) => a.year - b.year);
  if (ordered.length === 0) return null;

  return (
    <nav aria-label="Línea del tiempo de los Retornos" className="-mx-4 overflow-x-auto px-4 pb-2">
      <ol
        className="grid min-w-max"
        style={{ gridTemplateColumns: `repeat(${ordered.length}, minmax(3.75rem, 1fr))` }}
      >
        {ordered.map((group, i) => {
          const active = activeYear === group.year;
          const isFirst = i === 0;
          const isLast = i === ordered.length - 1;
          return (
            <li key={group.code} className="relative flex justify-center">
              {/* Tramo de la línea con el color del Retorno (redondeado en los extremos). */}
              <span
                aria-hidden
                className={`absolute inset-x-0 top-2 h-1.5 ${isFirst ? "rounded-l-full" : ""} ${isLast ? "rounded-r-full" : ""}`}
                style={{ backgroundColor: group.color }}
              />
              <button
                type="button"
                onClick={() => onSelect(group.year)}
                aria-pressed={active}
                aria-label={`Retorno ${group.year}, ${RETURN_STATE_LABEL[group.state]}`}
                className="group relative flex cursor-pointer flex-col items-center gap-2 rounded-lg px-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <span
                  aria-hidden
                  className={`size-[22px] rounded-full border-[3px] bg-bg transition-transform group-hover:scale-110 ${
                    active ? "scale-110 ring-[6px]" : ""
                  }`}
                  style={{
                    borderColor: group.color,
                    // El halo del activo usa el mismo color, translúcido.
                    ["--tw-ring-color" as string]: `${group.color}55`,
                    backgroundColor: active ? group.color : undefined,
                  }}
                />
                <span
                  className={`text-lg font-bold leading-tight md:text-xl ${active ? "text-primary" : "text-text"}`}
                >
                  {group.year}
                </span>
                <span className={`text-[11px] font-medium ${active ? "text-primary" : "text-text-muted"}`}>
                  {RETURN_STATE_LABEL[group.state]}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

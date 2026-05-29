"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Spinner from "@/components/feedback/Spinner";
import { AnimatedList } from "@/components/common/AnimatedList";
import { SearchInput } from "@/components/forms/SearchInput";
import { useListColonies } from "../../hooks/useListColonies";
import { ColonyCard } from "./ColonyCard";
import { CreateColonyButton } from "../createColony/components/CreateColonyButton";
import type { ColonyData } from "@/types/colony.types";
import { sortColonies } from "../../utils/colony-sorter";

export function ColoniesPanel() {
  const { colonies, loading, error, refetch } = useListColonies(true);
  const [filteredColonies, setFilteredColonies] = useState<ColonyData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const sortedColonies = useMemo(() => sortColonies(colonies), [colonies]);

  useEffect(() => {
    setFilteredColonies(sortedColonies);
  }, [sortedColonies]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query) {
        setFilteredColonies(sortedColonies);
        return;
      }
      const lowerQuery = query.toLowerCase();
      const filtered = sortedColonies.filter(
        (c) =>
          c.ciudad?.toLowerCase().includes(lowerQuery) ||
          c.pais?.toLowerCase().includes(lowerQuery) ||
          c.departamento?.toLowerCase().includes(lowerQuery),
      );
      setFilteredColonies(filtered);
    },
    [sortedColonies],
  );

  const resetSearch = useCallback(() => {
    handleSearch("");
  }, [handleSearch]);



  return (
    <div className="w-full">
      <header className="mx-10 px-8 py-4 rounded-xl shadow-xl bg-bg-card sticky top-0 z-20">
        <div className="flex items-center justify-between gap-10">
          <div className="flex items-center flex-1">
            <div className="shrink-0 pr-6">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Administración
              </span>
              <h1 className="text-3xl font-bold text-primary leading-none">
                Colonias
              </h1>
            </div>

            <div className="w-px h-12 bg-bg-separator mx-4 shrink-0" />

            <div className="shrink-0 px-6">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Total Registros
              </span>
              <span className="text-3xl font-bold text-secondary leading-none block">
                {filteredColonies.length}
              </span>
            </div>

            <div className="w-px h-12 bg-bg-separator mx-4 shrink-0" />

            <div className="flex-1 max-w-md pl-6">
              <SearchInput
                placeholder="Buscar por ciudad, departamento o país..."
                onSearch={handleSearch}
                value={searchQuery}
                loading={loading}
                minLength={1}
                debounceTime={0}
              />
            </div>
          </div>

          <div className="shrink-0 self-center">
            <CreateColonyButton onRefresh={refetch} />
          </div>
        </div>
      </header>

      <main className="space-y-8 pb-8 md:pb-10 pt-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-primary">
              <Spinner size="sm" />
              <span className="font-medium">Cargando colonias...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center p-8">
            <div className="bg-red-100 text-red-500 rounded-xl p-6 text-center w-full max-w-md shadow-sm">
              <p className="font-semibold mb-2">Error de Conexión</p>
              <p className="text-sm opacity-90">{error}</p>
              <button
                onClick={() => refetch()}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="mx-auto max-w-7xl px-10">
            <AnimatedList
              items={filteredColonies}
              keyExtractor={(colony) => colony.codigo}
              containerClassName="grid gap-4 w-full"
              emptyMessage={
                colonies.length > 0
                  ? "No se encontraron colonias que coincidan con tu búsqueda."
                  : "No hay colonias registradas actualmente."
              }
              onEmptyActionClick={colonies.length > 0 ? resetSearch : undefined}
              emptyActionLabel={
                colonies.length > 0 ? "Ver todas las colonias" : undefined
              }
              renderItem={(colony, index) => (
                <ColonyCard
                  colony={colony}
                  index={index}
                  onRefresh={refetch}
                />
              )}
            />
          </div>
        )}
      </main>
    </div>
  );
}

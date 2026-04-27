"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/ui/animations/Spinner";
import { useListColonies } from "../hooks/useListColonies";
import { ColonyCard } from "./ColonyCard";
import { Autocomplete } from "@/components/Autocomplete";
import { CreateColonyButton } from "../../createColony/components/CreateColonyButton";
import type { ColonyItem } from "@/types/colony.types";

export function ListColonies() {
  const { colonies, loading, error, refetch } = useListColonies();
  const [filteredColonies, setFilteredColonies] = useState<ColonyItem[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFilteredColonies(colonies);
  }, [colonies]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredColonies(colonies);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = colonies.filter(
      (c) =>
        c.ciudad?.toLowerCase().includes(lowerQuery) ||
        c.pais?.toLowerCase().includes(lowerQuery) ||
        c.departamento?.toLowerCase().includes(lowerQuery)
    );
    setFilteredColonies(filtered);
  };

  const resetSearch = () => {
    handleSearch("");
  };

  return (
    <div className="w-full md:pb-30 space-y-8">
      <header className="mx-10 px-8 py-4 rounded-xl shadow-xl bg-bg-card sticky top-0 z-20">
        <div className="flex items-end justify-between gap-10">
          <div className="flex items-end gap-12 flex-1">
            <div className="shrink-0">
              <span className="text-md font-medium text-text-muted uppercase tracking-wide">
                Administración
              </span>
              <p className="text-3xl font-bold text-secondary">Colonias</p>
            </div>

            <div className="shrink-0 border-l border-bg-separator pl-10">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide">
                Total
              </span>
              <p className="text-4xl font-bold text-secondary leading-tight">
                {filteredColonies.length}
              </p>
            </div>

            {/* Buscador de Colonias */}
            <div className="flex-1 max-w-md self-center">
              <Autocomplete<ColonyItem>
                placeholder="Buscar por ciudad o país..."
                onSearch={handleSearch}
                value={searchQuery}
                results={[]}
                loading={loading}
                minLength={1}
                showDropdown={false}
                onSelect={() => { }}
                getDisplayValue={(c) => `${c.ciudad}, ${c.pais}`}
                renderItem={() => null}
              />
            </div>
          </div>

          <div className="shrink-0 self-center">
            <CreateColonyButton onRefresh={refetch} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-10">
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

        <AnimatePresence>
          {!loading && colonies.length > 0 && filteredColonies.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20 text-text-muted bg-bg-card rounded-2xl border border-dashed border-bg-border mx-10"
            >
              <p className="text-lg font-medium">No se encontraron colonias que coincidan con tu búsqueda.</p>
              <button
                onClick={resetSearch}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Ver todas las colonias
              </button>
            </motion.div>
          )}

          {!loading && filteredColonies.length > 0 && (
            <motion.div
              className="grid gap-6 pb-10 w-full"
              key="colony-grid"
              layout
            >
              {filteredColonies.map((colony, index) => (
                <motion.div
                  key={colony.codigo}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    layout: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 }
                  }}
                >
                  <ColonyCard
                    colony={colony}
                    index={index}
                    onRefresh={refetch}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import Spinner from "@/components/feedback/Spinner";
import { AnimatedList } from "@/components/common/AnimatedList";
import { useListReturn } from "../../hooks/useListReturns";
import { RetornoCard } from "./RetornoCard";
import { CreateRetornoButton } from "../../createReturn/components/CreateRetornoButton";

export function RetornosPanel() {
  const { returns, loading, error, refetch } = useListReturn(true);
  const sortedReturns = useMemo(() => {
    return [...returns].sort((a, b) => {
      const aIsActive = a.estado.toLowerCase() === "activo" || a.estado.toLowerCase() === "en_curso";
      const bIsActive = b.estado.toLowerCase() === "activo" || b.estado.toLowerCase() === "en_curso";

      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;

      return b.anio - a.anio;
    });
  }, [returns]);

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
                Retornos
              </h1>
            </div>

            <div className="w-px h-12 bg-bg-separator mx-4 shrink-0" />

            <div className="shrink-0 px-6">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Total Registros
              </span>
              <span className="text-3xl font-bold text-secondary leading-none block">
                {sortedReturns.length}
              </span>
            </div>
          </div>

          <div className="shrink-0 self-center">
            <CreateRetornoButton onRefresh={refetch} />
          </div>
        </div>
      </header>

      <main className="space-y-8 pb-8 md:pb-10 pt-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-primary">
              <Spinner size="sm" />
              <span className="font-medium">Cargando retornos...</span>
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
              items={sortedReturns}
              keyExtractor={(retorno) => retorno.codigo.toString()}
              containerClassName="grid gap-4 w-full"
              emptyMessage="No hay retornos registrados actualmente."
              renderItem={(retorno, index) => (
                <RetornoCard
                  retorno={retorno}
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

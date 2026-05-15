"use client";

import { useState, useEffect, useCallback } from "react";
import Spinner from "@/components/feedback/Spinner";
import { AnimatedList } from "@/components/common/AnimatedList";
import { SearchInput } from "@/components/forms/SearchInput";
import { CreatePublicationButton } from "@/features/management/publication/administration/createPublication/components/CreatePublicationButton";
import { PublicationCard } from "./PublicationCard";
import { PublicationData } from "@/types/publication.types";
import { usePublications } from "../hooks/usePublications";
import { Retorno } from "@/types/retorno.types";
import { getRetornosService } from "@/services/retorno.service";
import { useAuth } from "@/auth/context/AuthContext";
import { SelectField } from "@/components/forms/SelectField";
import { SingleValue } from "react-select";

type RetornoOption = { label: string; value: number };


export function PublicationsPanel() {
  const { user } = useAuth();
  const [retornos, setRetornos] = useState<Retorno[]>([]);
  const [selectedRetornoId, setSelectedRetornoId] = useState<number | undefined>(undefined);
  
  const { publications, loading, error, refetch } = usePublications(selectedRetornoId);
  const [filteredPublications, setFilteredPublications] = useState<
    PublicationData[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRetornos = async () => {
      try {
        const data = await getRetornosService();
        setRetornos(data);
        
        const userRetornoId = user?.codigo_retorno;
        if (userRetornoId && data.some(r => r.codigo === userRetornoId)) {
          setSelectedRetornoId(userRetornoId);
        } else if (data.length > 0) {
          setSelectedRetornoId(data[0].codigo);
        }
      } catch (err) {
        console.error("Error fetching retornos", err);
      }
    };
    fetchRetornos();
  }, [user]);

  useEffect(() => {
    setFilteredPublications(publications);
  }, [publications]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query) {
        setFilteredPublications(publications);
        return;
      }
      const lowerQuery = query.toLowerCase();
      const filtered = publications.filter(
        (p) =>
          p.titulo?.toLowerCase().includes(lowerQuery) ||
          p.resena?.toLowerCase().includes(lowerQuery),
      );
      setFilteredPublications(filtered);
    },
    [publications],
  );

  const resetSearch = useCallback(() => {
    handleSearch("");
  }, [handleSearch]);

  return (
    <div className="w-full">
      <header className="mx-10 px-8 py-4 rounded-xl shadow-xl bg-bg-card sticky top-0 z-20 border border-bg-border/50 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
            <div className="shrink-0">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Administración
              </span>
              <h1 className="text-3xl font-bold text-primary leading-none">
                Publicaciones
              </h1>
            </div>

            <div className="hidden md:block w-px h-12 bg-bg-separator shrink-0" />

            <div className="shrink-0 min-w-[220px]">
              <SelectField
                label="Seleccionar Retorno"
                options={retornos.map((r) => ({
                  label: `Caravana ${r.anio} (${r.estado})`,
                  value: r.codigo,
                }))}
                value={
                  selectedRetornoId
                    ? {
                        label: `Caravana ${
                          retornos.find((r) => r.codigo === selectedRetornoId)
                            ?.anio
                        } (${
                          retornos.find((r) => r.codigo === selectedRetornoId)
                            ?.estado
                        })`,
                        value: selectedRetornoId,
                      }
                    : null
                }
                onChange={(option: SingleValue<RetornoOption>) => setSelectedRetornoId(option?.value)}
                isSearchable={false}
              />
            </div>

            <div className="hidden md:block w-px h-12 bg-bg-separator shrink-0" />

            <div className="flex-1 max-w-md">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Buscar Contenido
              </span>
              <SearchInput
                placeholder="Título o reseña..."
                onSearch={handleSearch}
                value={searchQuery}
                loading={loading}
                minLength={1}
                debounceTime={0}
              />
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-8">
            <div className="text-right hidden lg:block">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Resultados
              </span>
              <span className="text-2xl font-black text-secondary leading-none block">
                {filteredPublications.length}
              </span>
            </div>
            <CreatePublicationButton 
              onRefresh={refetch} 
              retornoId={selectedRetornoId} 
            />
          </div>
        </div>
      </header>

      <main className="space-y-8 pb-8 md:pb-10 pt-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-primary">
              <Spinner size="lg" />
              <span className="font-medium">Cargando publicaciones...</span>
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
              items={filteredPublications}
              keyExtractor={(pub) => pub.codigo.toString()}
              containerClassName="grid gap-4 w-full"
              emptyMessage={
                publications.length > 0
                  ? "No se encontraron publicaciones que coincidan con tu búsqueda."
                  : "No hay publicaciones registradas actualmente."
              }
              onEmptyActionClick={
                publications.length > 0 ? resetSearch : undefined
              }
              emptyActionLabel={
                publications.length > 0
                  ? "Ver todas las publicaciones"
                  : undefined
              }
              renderItem={(pub, index) => (
                <PublicationCard publication={pub} index={index} />
              )}
            />
          </div>
        )}
      </main>
    </div>
  );
}

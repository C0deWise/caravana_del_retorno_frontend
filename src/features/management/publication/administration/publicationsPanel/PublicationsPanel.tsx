"use client";

import { useState, useEffect, useCallback } from "react";
import Spinner from "@/components/feedback/Spinner";
import { AnimatedList } from "@/components/common/AnimatedList";
import { SearchInput } from "@/components/forms/SearchInput";
import { CreatePublicationButton } from "@/features/management/publication/administration/createPublication/components/CreatePublicationButton";
import { PublicationCard } from "./PublicationCard";
import { PublicationData } from "@/types/publication.types";

const mockPublications: PublicationData[] = [
  {
    codigo: 1,
    codigo_retorno: 101,
    codigo_colonia: 1,
    codigo_autor: 10,
    titulo: "Historia de nuestra comunidad",
    resena:
      "Un recuento detallado de cómo nació nuestra colonia y sus primeros pobladores.",
    fecha_creacion: "2024-01-15T10:30:00Z",
  },
  {
    codigo: 2,
    codigo_retorno: 102,
    codigo_colonia: 1,
    codigo_autor: 11,
    titulo: "Tradiciones y celebraciones",
    resena:
      "Exploramos las tradiciones más importantes que caracterizan a nuestra comunidad.",
    fecha_creacion: "2024-02-20T14:45:00Z",
  },
  {
    codigo: 3,
    codigo_retorno: 103,
    codigo_colonia: 2,
    codigo_autor: 12,
    titulo: "Proyectos comunitarios 2024",
    resena:
      "Iniciativas y proyectos que estamos desarrollando para mejorar la calidad de vida.",
    fecha_creacion: "2024-03-10T09:15:00Z",
  },
];

export function PublicationsPanel() {
  const [publications] = useState<PublicationData[]>(mockPublications);
  const loading = false;
  const error = null;
  const refetch = () => {};
  const [filteredPublications, setFilteredPublications] = useState<
    PublicationData[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      <header className="mx-10 px-8 py-4 rounded-xl shadow-xl bg-bg-card sticky top-0 z-20">
        <div className="flex items-center justify-between gap-10">
          <div className="flex items-center flex-1">
            <div className="shrink-0 pr-6">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Administración
              </span>
              <h1 className="text-3xl font-bold text-primary leading-none">
                Publicaciones
              </h1>
            </div>

            <div className="w-px h-12 bg-bg-separator mx-4 shrink-0" />

            <div className="shrink-0 px-6">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide mb-1 block">
                Total Registros
              </span>
              <span className="text-3xl font-bold text-secondary leading-none block">
                {filteredPublications.length}
              </span>
            </div>

            <div className="w-px h-12 bg-bg-separator mx-4 shrink-0" />

            <div className="flex-1 max-w-md pl-6">
              <SearchInput
                placeholder="Buscar por título o contenido..."
                onSearch={handleSearch}
                value={searchQuery}
                loading={loading}
                minLength={1}
                debounceTime={0}
              />
            </div>
          </div>

          <div className="shrink-0 self-center">
            <CreatePublicationButton onRefresh={refetch} />
          </div>
        </div>
      </header>

      <main className="space-y-8 pb-8 md:pb-10 pt-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-primary">
              <Spinner size="sm" />
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

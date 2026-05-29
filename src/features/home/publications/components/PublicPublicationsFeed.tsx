"use client";

import { useState } from "react";
import { usePublicReturns } from "../hooks/usePublicReturns";
import { usePublicPublications } from "../hooks/usePublicPublications";
import { PublicPublicationCard } from "./PublicPublicationCard";
import Spinner from "@/components/feedback/Spinner";

export function PublicPublicationsFeed() {
  const { returns, loading: returnsLoading, error: returnsError } = usePublicReturns();
  const [selectedRetornoId, setSelectedRetornoId] = useState<number | null>(null);

  const effectiveRetornoId = selectedRetornoId ?? (returns.length > 0 ? returns[0].codigo : null);

  const { publications, loading: pubsLoading, error: pubsError } = usePublicPublications(effectiveRetornoId);

  if (returnsLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24">
        <Spinner size="lg" className="text-primary mb-4" />
        <p className="text-text-muted font-medium animate-pulse">Cargando experiencias...</p>
      </div>
    );
  }

  if (returnsError || returns.length === 0) {
    return (
      <div className="w-full py-20 text-center">
        <h3 className="text-2xl font-bold text-text-muted">
          {returnsError || "Aún no hay retornos disponibles."}
        </h3>
      </div>
    );
  }

  const renderContent = () => {
    if (pubsLoading) {
      return (
        <div className="w-full h-80 flex flex-col items-center justify-center">
          <Spinner size="lg" className="text-primary mb-4" />
          <p className="text-text-muted font-medium animate-pulse">Cargando historias...</p>
        </div>
      );
    }

    if (pubsError) {
      return (
        <div className="w-full py-12 text-center bg-accent-red/5 rounded-3xl border border-accent-red/20">
          <p className="text-accent-red font-bold text-lg">{pubsError}</p>
        </div>
      );
    }

    if (publications.length === 0) {
      return (
        <div className="w-full py-24 text-center flex flex-col items-center justify-center bg-bg-muted/30 rounded-[3rem] border border-bg-border/30 border-dashed">
          <svg className="w-20 h-20 text-text-muted/30 mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-2xl font-black text-text-muted">Aún no hay publicaciones en este retorno</h3>
          <p className="text-text-muted/70 mt-3 max-w-md text-lg">Vuelve más tarde para descubrir las experiencias compartidas por la comunidad.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
        {publications.map((pub) => (
          <PublicPublicationCard key={pub.codigo} publication={pub} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">

      {/* selector de Retornos */}
      <div className="w-full mb-16 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text mb-10 text-center tracking-tight">
          Experiencias de la <span className="text-primary bg-primary/10 px-4 py-1 rounded-2xl inline-block mt-2 md:mt-0 transform -rotate-1 shadow-sm">Caravana</span>
        </h2>

        <div className="flex overflow-x-auto gap-3 p-2 bg-bg-muted/80 rounded-full max-w-full custom-scrollbar backdrop-blur-md border border-bg-border/50 shadow-inner">
          {returns.map((retorno) => (
            <button
              key={retorno.codigo}
              onClick={() => setSelectedRetornoId(retorno.codigo)}
              className={`
                px-8 py-3.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300
                ${effectiveRetornoId === retorno.codigo
                  ? "bg-primary text-white shadow-lg scale-100"
                  : "bg-transparent text-text-muted hover:bg-bg-hover hover:text-text scale-95"
                }
              `}
            >
              Retorno {retorno.anio}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Publicaciones */}
      <div className="w-full min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
}

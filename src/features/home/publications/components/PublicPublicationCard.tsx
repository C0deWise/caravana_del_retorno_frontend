"use client";

import Image from "next/image";
import { PublicationData } from "@/types/publication.types";
import { useState } from "react";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";

interface PublicPublicationCardProps {
  readonly publication: PublicationData;
}

export function PublicPublicationCard({ publication }: PublicPublicationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setActiveMediaIndex(0), 300);
  };

  const coverFile = publication.multimedia_lista?.[0];
  const isCoverVideo = coverFile?.tipo?.toLowerCase().includes("vid") || coverFile?.formato?.toLowerCase().includes("mp4");

  const activeMedia = publication.multimedia_lista?.[activeMediaIndex] || coverFile;
  const isActiveVideo = activeMedia?.tipo?.toLowerCase().includes("vid") || activeMedia?.formato?.toLowerCase().includes("mp4");

  const renderCardCover = () => {
    if (!coverFile) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-primary/5">
          <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L16.5 5.5M8 11l3 3l3-3m-3 3V8" />
          </svg>
          <span className="text-sm font-medium">Sin imagen</span>
        </div>
      );
    }

    if (isCoverVideo) {
      return (
        <video
          src={coverFile.url}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          muted playsInline loop autoPlay
        >
          <track kind="captions" srcLang="es" label="Español" />
        </video>
      );
    }

    return (
      <Image
        src={coverFile.url}
        alt={publication.titulo}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        unoptimized
        priority
      />
    );
  };

  const renderModalMedia = () => {
    if (!activeMedia) {
      return (
        <div className="w-full h-full flex items-center justify-center text-white/50 bg-bg-muted">
          <span>Sin contenido multimedia</span>
        </div>
      );
    }

    if (isActiveVideo) {
      return (
        <video key={activeMedia.url} src={activeMedia.url} className="w-full h-full object-contain" controls autoPlay>
          <track kind="captions" srcLang="es" label="Español" />
        </video>
      );
    }

    return <Image key={activeMedia.url} src={activeMedia.url} alt={activeMedia.descripcion || publication.titulo} fill className="object-contain" unoptimized />;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-4xl bg-bg shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-bg-border/40 flex flex-col h-[420px] text-left w-full focus:outline-none focus:ring-4 focus:ring-primary/30"
      >
        <div className="relative h-3/5 w-full overflow-hidden bg-bg-muted">
          {renderCardCover()}

          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

          <div className="absolute bottom-5 left-6 right-6">
            <h3 className="text-2xl font-black text-white line-clamp-2 leading-tight drop-shadow-md">
              {publication.titulo}
            </h3>
            <p className="text-white/80 text-sm mt-2 font-medium">
              Por: {publication.nombre_autor || `Usuario #${publication.autor}`}
            </p>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between bg-bg relative">
          <p className="text-text-muted text-sm line-clamp-3 leading-relaxed">
            {publication.resena || "Sin reseña"}
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-bg-border/30">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              {new Date(publication.fecha_creacion).toLocaleDateString("es-CO", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="text-secondary group-hover:translate-x-1 transition-transform p-1 bg-secondary/10 rounded-full">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </button>

      <AnimatedModal isOpen={isModalOpen} onBackdropClick={handleClose} maxWidth="max-w-5xl">
        <div className="bg-bg rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh]">
          <div className="w-full md:w-1/2 h-72 md:h-auto bg-[#0a0a0a] relative shrink-0">
            {renderModalMedia()}
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto custom-scrollbar">
            <h2 className="text-4xl font-black text-text mb-3 leading-[1.1] tracking-tight">{publication.titulo}</h2>
            <p className="text-sm text-text-muted mb-8 pb-5 border-b border-bg-border/40">
              Escrito por <span className="font-bold text-primary">{publication.nombre_autor || `Usuario #${publication.autor}`}</span> • {new Date(publication.fecha_creacion).toLocaleDateString("es-CO", { month: "long", day: "numeric", year: "numeric" })}
            </p>

            <div className="flex-1">
              <p className="text-lg leading-relaxed text-text/90 whitespace-pre-wrap font-medium">{publication.resena}</p>
            </div>

            {publication.multimedia_lista && publication.multimedia_lista.length > 1 && (
              <div className="mt-10 pt-8 border-t border-bg-border/40">
                <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-4">Archivos de la publicación ({publication.multimedia_lista.length})</h4>
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {publication.multimedia_lista.map((file, idx) => {
                    const isVid = file.tipo?.toLowerCase().includes("vid") || file.formato?.toLowerCase().includes("mp4");
                    const isActive = idx === activeMediaIndex;
                    return (
                      <button
                        key={file.codigo}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`shrink-0 w-24 h-24 relative rounded-2xl overflow-hidden border-2 transition-all group shadow-sm ${isActive ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-transparent hover:border-primary/50'}`}
                      >
                        {isVid ? (
                          <video src={file.url} className={`w-full h-full object-cover transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'}`} muted playsInline>
                            <track kind="captions" srcLang="es" label="Español" />
                          </video>
                        ) : (
                          <Image src={file.url} alt={file.descripcion || "Imagen"} fill className={`object-cover transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-90 group-hover:scale-110'}`} unoptimized />
                        )}
                        {isVid && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <svg className="w-8 h-8 text-white drop-shadow-md opacity-90" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button onClick={handleClose} className="px-8 py-3 bg-bg-separator hover:bg-bg-border text-text font-bold rounded-2xl transition-all hover:scale-105 active:scale-95">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </AnimatedModal>
    </>
  );
}

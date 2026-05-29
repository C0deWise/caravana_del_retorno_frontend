"use client";

import Image from "next/image";

import { useState, useEffect } from "react";
import { NewspaperIcon, EyeIcon } from "@heroicons/react/24/solid";
import ListCard from "@/components/common/ListCard";
import { PublicationData, PublicationMultimedia } from "@/types/publication.types";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import { MarqueeText } from "@/components/common/MarqueeText";

interface PublicationCardProps {
  readonly publication: PublicationData;
  readonly index: number;
}

const renderFilePreview = (file: PublicationMultimedia) => {
  const isImage = file.tipo?.toLowerCase().includes("imag") || 
                  /(png|jpg|jpeg)/.test(file.formato?.toLowerCase() || "");
  const isVideo = file.tipo?.toLowerCase().includes("vid") || 
                  file.formato?.toLowerCase().includes("mp4");

  if (isImage) {
    return (
      <Image
        src={file.url}
        alt={file.descripcion || `Archivo ${file.tipo}`}
        fill
        className="object-cover"
        unoptimized
      />
    );
  }
  
  if (isVideo) {
    return (
      <video src={file.url} className="w-full h-full object-cover" muted playsInline>
        <track kind="captions" srcLang="es" label="Sin subtítulos" />
      </video>
    );
  }

  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  );
};

export function PublicationCard({ publication, index }: PublicationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const authorName = publication.nombre_autor || "Desconocido";

  const formattedDate = publication.fecha_creacion 
    ? new Date(publication.fecha_creacion).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : "Sin fecha";

  return (
    <>
      <ListCard
        index={index}
        icon={<NewspaperIcon className="w-7 h-7 text-text-inverse" />}
        title={publication.titulo}
        subtitle={
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span className="font-medium text-secondary">Autor: {authorName}</span>
            <span>•</span>
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="text-green-600">Publicado</span>
          </div>
        }
        actions={
          <button
            title="Ver publicación"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-text-inverse font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <EyeIcon className="w-5 h-5" />
            <span>Ver publicación</span>
          </button>
        }
      />
      <AnimatedModal isOpen={isModalOpen} onBackdropClick={() => setIsModalOpen(false)}>
        <div className="bg-bg-card rounded-xl p-6 shadow-xl border border-bg-border/50">
          <h2 className="text-2xl font-bold text-primary mb-4">{publication.titulo}</h2>
          <div className="space-y-4 text-text">
            <div>
              <span className="font-semibold text-secondary block mb-1">Reseña</span>
              <p className="text-sm bg-bg p-3 rounded-lg border border-bg-border/50">
                {publication.resena || "Sin reseña"}
              </p>
            </div>
            {publication.multimedia_lista && publication.multimedia_lista.length > 0 && (
              <div className="w-full overflow-hidden">
                <span className="font-semibold text-secondary block mb-2">Archivos Adjuntos</span>
                <div className="flex flex-col gap-2 w-full overflow-hidden">
                  {publication.multimedia_lista.map((file) => (
                    <a
                      key={file.codigo}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-bg-border/50 hover:border-primary/50 transition-colors group w-full overflow-hidden"
                    >
                      <div className="relative shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors overflow-hidden">
                        {renderFilePreview(file)}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <MarqueeText
                          text={file.descripcion || `Archivo ${file.tipo}`}
                          className="text-sm font-medium text-text whitespace-nowrap"
                          speed={30}
                        />
                        <p className="text-xs text-text-muted uppercase mt-0.5 truncate">
                          {file.tipo} • {file.formato}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-text-muted mt-4">
              <div><span className="font-semibold">Autor:</span> {authorName}</div>
              <div><span className="font-semibold">Fecha:</span> {formattedDate}</div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-bg-separator hover:bg-bg-border text-text font-medium rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </AnimatedModal>
    </>
  );
}

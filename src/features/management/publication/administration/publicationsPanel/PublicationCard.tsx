"use client";

import { useState, useEffect } from "react";
import { NewspaperIcon, EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import ListCard from "@/components/common/ListCard";
import { PublicationData } from "@/types/publication.types";
import { userService } from "@/services/user.service";

interface PublicationCardProps {
  readonly publication: PublicationData;
  readonly index: number;
}

export function PublicationCard({ publication, index }: PublicationCardProps) {
  const [authorName, setAuthorName] = useState<string>(() => {
    const cached = userService.getUserFromCache(publication.autor);
    return cached ? `${cached.nombre} ${cached.apellido}` : "Cargando...";
  });

  useEffect(() => {
    const cached = userService.getUserFromCache(publication.autor);
    if (cached) {
      setAuthorName(`${cached.nombre} ${cached.apellido}`);
      return;
    }

    const fetchAuthor = async () => {
      try {
        const userData = await userService.getUserById(publication.autor);
        setAuthorName(`${userData.nombre} ${userData.apellido}`);
      } catch {
        setAuthorName(`ID: ${publication.autor}`);
      }
    };
    fetchAuthor();
  }, [publication.autor]);

  const formattedDate = publication.fecha_creacion 
    ? new Date(publication.fecha_creacion).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : "Sin fecha";

  return (
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
        <>
          <button
            title="Ver publicación"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            title="Editar publicación"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          <button
            title="Eliminar publicación"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-red/10 text-accent-red hover:bg-accent-red/20 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </>
      }
    />
  );
}

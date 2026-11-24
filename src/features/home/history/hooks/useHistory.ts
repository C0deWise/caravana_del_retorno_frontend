"use client";

import { useEffect, useState } from "react";
import { historyService } from "../services/history.service";
import { returnColor } from "../config/history.config";
import type {
  GalleryItem,
  PublicationApi,
  ReturnApi,
  ReturnGroup,
} from "../types/history.types";
import { mediaKind, youTubeThumbnail } from "../utils/media";

/** Convierte las publicaciones de un Retorno en elementos de galería (uno por archivo). */
function toGalleryItems(ret: ReturnApi, publications: PublicationApi[]): GalleryItem[] {
  return publications.flatMap((pub) => {
    const { multimedia_lista, ...publication } = pub;
    return multimedia_lista.map<GalleryItem>((media) => {
      const kind = mediaKind(media);
      return {
        key: `m-${media.codigo}`,
        returnCode: ret.codigo,
        year: ret.anio,
        kind,
        src: media.url,
        thumbnail: kind === "embed" ? youTubeThumbnail(media.url) : undefined,
        description: media.descripcion || undefined,
        publication: { ...publication, mediaCount: multimedia_lista.length },
      };
    });
  });
}

interface UseHistoryReturn {
  groups: ReturnGroup[];
  loading: boolean;
  error: boolean;
}

/**
 * Carga todos los Retornos y sus publicaciones (en paralelo) y los agrupa
 * por año, del más reciente al más antiguo.
 *
 * Un Retorno sin publicaciones queda con `items` vacío (la UI muestra el
 * estado vacío). Si la consulta de un Retorno falla, ese grupo queda vacío sin afectar al resto.
 */
export function useHistory(): UseHistoryReturn {
  const [groups, setGroups] = useState<ReturnGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const returns = [...(await historyService.getReturns())].sort(
          (a, b) => b.anio - a.anio,
        );

        // Posición cronológica (0 = más antiguo) para asignar el color de cada Retorno.
        const chronological = [...returns].reverse();

        const loaded = await Promise.all(
          returns.map(async (ret): Promise<ReturnGroup> => {
            const publications = await historyService
              .getPublications(ret.codigo)
              .catch(() => [] as PublicationApi[]);

            return {
              code: ret.codigo,
              year: ret.anio,
              state: ret.estado,
              publicationsCount: publications.length,
              items: toGalleryItems(ret, publications),
              color: returnColor(chronological.indexOf(ret)),
            };
          }),
        );

        if (!cancelled) setGroups(loaded);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { groups, loading, error };
}

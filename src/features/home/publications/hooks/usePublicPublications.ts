import { useState, useCallback, useEffect } from "react";
import { PublicationData } from "@/types/publication.types";
import { getPublicPublicationsByRetornoService } from "../services/public.service";
import { ApiError } from "@/services/api.services";

export function usePublicPublications(retornoId: number | null) {
  const [publications, setPublications] = useState<PublicationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublications = useCallback(async () => {
    if (!retornoId) {
      setPublications([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicPublicationsByRetornoService(retornoId);
      setPublications(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Error al cargar las publicaciones");
      }
      setPublications([]);
    } finally {
      setLoading(false);
    }
  }, [retornoId]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  return { publications, loading, error, refetch: fetchPublications };
}

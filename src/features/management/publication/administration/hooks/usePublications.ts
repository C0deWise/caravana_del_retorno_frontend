import { useState, useCallback, useEffect } from "react";
import { PublicationData } from "@/types/publication.types";
import { getPublicationsByRetornoService } from "../createPublication/services/publication.service";
import { useAuth } from "@/auth/context/AuthContext";

export function usePublications(externalRetornoId?: number) {
  const { user } = useAuth();
  const [publications, setPublications] = useState<PublicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authRetornoId = user?.codigo_retorno ?? 0;
  const retornoId = externalRetornoId ?? authRetornoId;

  const fetchPublications = useCallback(async () => {
    if (!retornoId) {
      setPublications([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicationsByRetornoService(retornoId);
      setPublications(data);
    } catch {
      setError("Error al cargar las publicaciones");
      setPublications([]);
    } finally {
      setLoading(false);
    }
  }, [retornoId]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  return {
    publications,
    loading,
    error,
    refetch: fetchPublications,
  };
}

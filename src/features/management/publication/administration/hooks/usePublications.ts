import { useState, useCallback, useEffect } from "react";
import { PublicationData } from "@/types/publication.types";
import { getPublicationsService } from "../createPublication/services/publication.service";

export function usePublications() {
  const [publications, setPublications] = useState<PublicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicationsService();
      setPublications(data); //TODO: Ajustar los codigos de error
    } catch {
      setError("Error al cargar las publicaciones");
    } finally {
      setLoading(false);
    }
  }, []);

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

import { useState, useCallback, useEffect } from "react";
import { Retorno } from "@/types/retorno.types";
import { getPublicReturnsService } from "../services/public.service";
import { ApiError } from "@/services/api.services";

export function usePublicReturns() {
  const [returns, setReturns] = useState<Retorno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicReturnsService();
      const sorted = [...data].sort((a, b) => b.anio - a.anio);
      setReturns(sorted);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Error al cargar los retornos");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  return { returns, loading, error, refetch: fetchReturns };
}

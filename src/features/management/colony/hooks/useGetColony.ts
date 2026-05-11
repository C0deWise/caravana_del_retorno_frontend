import { useCallback, useState } from "react";
import { ApiError } from "@/services/api.services";
import { coloniaService } from "../services/colony.service";
import type { ColonyData } from "@/types/colony.types";

interface UseGetColonyReturn {
  getColony: (codigo: number) => Promise<ColonyData | null>;
  colony: ColonyData | null;
  loading: boolean;
  error: string | null;
}

export const useGetColony = (): UseGetColonyReturn => {
  const [colony, setColony] = useState<ColonyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getColony = useCallback(async (codigo: number): Promise<ColonyData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await coloniaService.getColonyById(codigo);
      setColony(response);
      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Error al cargar la información de la colonia");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getColony, colony, loading, error };
};

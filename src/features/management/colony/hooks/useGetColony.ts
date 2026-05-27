import { useCallback, useState } from "react";
import { ApiError } from "@/services/api.services";
import { coloniaService } from "../services/colony.service";
import type { ColonyData } from "@/types/colony.types";
import { getMockColonies } from "@/mocks/colony.mock";
import { FEATURE_FLAGS } from "@/config/featureFlags";

interface UseGetColonyReturn {
  getColony: (codigo: number) => Promise<ColonyData | null>;
  colony: ColonyData | null;
  loading: boolean;
  error: string | null;
}

export const useGetColony = (useMocks = FEATURE_FLAGS.USE_COLONY_MOCKS): UseGetColonyReturn => {
  const [colony, setColony] = useState<ColonyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getColony = useCallback(async (codigo: number): Promise<ColonyData | null> => {
    setLoading(true);
    setError(null);

    if (useMocks) {
      const mockData = getMockColonies().find(c => c.codigo === codigo) ?? null;
      setColony(mockData);
      if (!mockData) setError("Colonia no encontrada (mock)");
      setLoading(false);
      return mockData;
    }

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

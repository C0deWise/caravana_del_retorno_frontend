import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/services/api.services";
import { coloniaService } from "../services/colony.service";
import type { ColonyData } from "@/types/colony.types";
import { getMockColonies } from "@/mocks/colony.mock";
import { FEATURE_FLAGS } from "@/config/featureFlags";

interface UseListColoniesReturn {
  listColonies: () => Promise<ColonyData[] | null>;
  refetch: () => Promise<ColonyData[] | null>;
  colonies: ColonyData[];
  loading: boolean;
  error: string | null;
}

export const useListColonies = (autoFetch = false, useMocks = FEATURE_FLAGS.USE_COLONY_MOCKS): UseListColoniesReturn => {
  const [colonies, setColonies] = useState<ColonyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listColonies = useCallback(async (): Promise<ColonyData[] | null> => {
    setLoading(true);
    setError(null);

    if (useMocks) {
      const mockData = getMockColonies();
      setColonies(mockData);
      setLoading(false);
      return mockData;
    }

    try {
      const response = await coloniaService.getColonias();
      setColonies(response);
      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Error al cargar las colonias");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      void listColonies();
    }
  }, [autoFetch, listColonies]);

  return { listColonies, refetch: listColonies, colonies, loading, error };
};

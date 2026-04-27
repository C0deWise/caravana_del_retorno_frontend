import { useCallback, useState } from "react";
import { ApiError } from "@/services/api.services";
import { coloniaService } from "../services/colony.service";
import type { ColonyItem } from "@/types/colony.types";

interface UseListColoniesReturn {
  listColonies: () => Promise<ColonyItem[] | null>;
  colonies: ColonyItem[];
  loading: boolean;
  error: string | null;
}

export const useListColonies = (): UseListColoniesReturn => {
  const [colonies, setColonies] = useState<ColonyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listColonies = useCallback(async (): Promise<ColonyItem[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await coloniaService.getColonias();
      setColonies(response);
      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Error de conexión, intenta de nuevo");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { listColonies, colonies, loading, error };
};

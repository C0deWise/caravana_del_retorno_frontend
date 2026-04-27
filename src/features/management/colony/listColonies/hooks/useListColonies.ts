import { useCallback, useEffect, useState } from "react";
import { listColoniesService } from "../services/listColonies.service";
import { ApiError } from "@/services/api.services";
import type { ColonyItem } from "@/types/colony.types";

export const useListColonies = () => {
  const [colonies, setColonies] = useState<ColonyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColonies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listColoniesService.getColonias();
      setColonies(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Error al cargar las colonias");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColonies();
  }, [fetchColonies]);

  return {
    colonies,
    loading,
    error,
    refetch: fetchColonies,
  };
};

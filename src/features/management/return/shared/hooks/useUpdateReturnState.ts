import { useState } from "react";
import { retornoService } from "../services/retorno.service";
import { ApiError } from "@/services/api.services";

export const useUpdateReturnState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateState = async (codigo: number, estado: string) => {
    setLoading(true);
    setError(null);
    try {
      await retornoService.updateState(codigo, estado);
      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Error al actualizar el estado del retorno");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setLoading(false);
  };

  return { updateState, loading, error, resetState };
};

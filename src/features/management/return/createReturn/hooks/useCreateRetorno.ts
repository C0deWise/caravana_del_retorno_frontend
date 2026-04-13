import { useState } from "react";
import { ApiError } from "@/services/api.services";
import { retornoService } from "../services/retorno.service";
import type { Retorno, RetornoCreateRequest } from "../../types/retorno.types";

interface UseCreateRetornoReturn {
  createRetorno: (data: RetornoCreateRequest) => Promise<Retorno | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
  resetState: () => void;
}

export const useCreateRetorno = (): UseCreateRetornoReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  const createRetorno = async (
    data: RetornoCreateRequest,
  ): Promise<Retorno | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!data.anio) {
        setError("El año es obligatorio");
        return null;
      }

      if (!data.estado.trim()) {
        setError("El estado es obligatorio");
        return null;
      }

      const response = await retornoService.create(data);

      setSuccess(true);
      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 409:
            setError(
              "Ya existe un evento de El Retorno para el año seleccionado.",
            );
            break;

          case 422:
            setError("Año anterior al año actual del sistema.");
            break;

          default:
            setError(err.message || "Error al crear el retorno.");
            break;
        }
      } else {
        setError("Error inesperado al crear el retorno.");
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRetorno,
    loading,
    error,
    success,
    resetState,
  };
};

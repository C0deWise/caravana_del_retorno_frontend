import { useState } from "react";
import { coloniaService } from "../services/createColony.service";
import { ApiError } from "@/services/api.services";
import type { ColonyData, ColonyApi } from "@/types/colony.types";

interface UseCreateColony {
  createColony: (data: ColonyData) => Promise<ColonyApi | null>;
  resetError: () => void;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const validateColonyData = (data: ColonyData): string | null => {
  const isColombia = data.pais === "Colombia";
  if (!data.pais || (isColombia && !data.departamento) || (isColombia && !data.ciudad)) {
    return "Todos los campos son obligatorios para Colombia";
  }
  return null;
};

const resolveErrorMessage = (err: unknown): string => {
  if (err instanceof ApiError) {
    if (err.status === 409) return err.message || "Ya existe una colonia con la misma ubicación.";
    if (err.status === 422) return "Datos inválidos o campos faltantes.";
    return err.message;
  }
  return "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.";
};

export const useCreateColony = (): UseCreateColony => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetError = () => setError(null);

  const createColony = async (data: ColonyData): Promise<ColonyApi | null> => {
    const validationError = validateColonyData(data);
    if (validationError) {
      setError(validationError);
      return null;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await coloniaService.createColony(data);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(resolveErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createColony,
    resetError,
    loading,
    error,
    success,
  };
};

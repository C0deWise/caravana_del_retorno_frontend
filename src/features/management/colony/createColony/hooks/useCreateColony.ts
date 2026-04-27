import { useState } from "react";
import { coloniaService } from "../services/createColony.service";
import { ApiError } from "@/services/api.services";
import type { ColonyData, ColonyApi } from "@/types/colony.types";

interface UseCreateColoniaReturn {
  createColonia: (data: ColonyData) => Promise<ColonyApi | null>;
  resetError: () => void;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useCreateColonia = (): UseCreateColoniaReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetError = () => setError(null);

  const createColonia = async (data: ColonyData): Promise<ColonyApi | null> => {
    const isColombia = data.pais === "Colombia";
    if (
      !data.pais ||
      (isColombia && !data.departamento) ||
      (isColombia && !data.ciudad)
    ) {
      setError("Todos los campos son obligatorios para Colombia");
      return null;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await coloniaService.createColonia(data);
      setSuccess(true);
      return response;
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError("Ya existe una colonia con la misma ubicación.");
        } else if (err.status === 422) {
          setError("Datos inválidos o campos faltantes.");
        } else {
          setError(err.message);
        }
      } else {
        setError(
          err instanceof Error ? err.message : "Error al crear la colonia",
        );
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createColonia,
    resetError,
    loading,
    error,
    success,
  };
};

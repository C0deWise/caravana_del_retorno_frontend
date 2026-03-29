import { useState } from "react";
import { coloniaService } from "../services/colonia.service";
import type { ColonyData, ColonyApi } from "@/types/colony.types";

interface UseCreateColoniaReturn {
  createColonia: (data: ColonyData) => Promise<ColonyApi | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useCreateColonia = (): UseCreateColoniaReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createColonia = async (data: ColonyData): Promise<ColonyApi | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const isColombia = data.pais === "Colombia";

      if (
        !data.pais ||
        (isColombia && !data.departamento) ||
        (isColombia && !data.ciudad)
      ) {
        setError("Todos los campos son obligatorios para Colombia");
        return null;
      }

      const response = await coloniaService.createColonia(data);

      return response;
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : "Error al crear la colonia";
      setError(mensaje);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createColonia,
    loading,
    error,
    success,
  };
};

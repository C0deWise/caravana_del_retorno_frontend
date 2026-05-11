import { useState } from "react";
import { deleteColonyService } from "../services/deleteColony.service";
import { ApiError } from "@/services/api.services";

interface UseDeleteColonyReturn {
  deleteColony: (id: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useDeleteColony = (): UseDeleteColonyReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteColony = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await deleteColonyService.deleteColony(id);
      setSuccess(true);
      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 404:
            setError("Colonia no encontrada.");
            break;
          case 409:
            setError("La colonia ya está desactivada.");
            break;
          case 422:
            setError("Error de validación en la solicitud.");
            break;
          default:
            setError(err.message || "Error inesperado al intentar desactivar la colonia.");
        }
      } else {
        setError(
          err instanceof Error ? err.message : "Error de conexión con el servidor",
        );
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteColony,
    loading,
    error,
    success,
  };
};

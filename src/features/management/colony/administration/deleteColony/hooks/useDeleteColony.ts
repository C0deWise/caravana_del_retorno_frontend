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
        // TODO: Cambiar los mensajes de error cuando la api este disponible
        switch (err.status) {
          case 404:
            setError("La colonia que intentas eliminar no existe.");
            break;
          case 403:
            setError("No tienes permisos para realizar esta acción.");
            break;
          case 409:
            setError("No se puede eliminar la colonia porque tiene registros asociados.");
            break;
          case 422:
            setError("Error en la solicitud de eliminación.");
            break;
          default:
            setError(err.message || "Error inesperado al eliminar la colonia.");
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

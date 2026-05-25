import { useState } from "react";
import { PublicationApiRequest } from "@/types/publication.types";
import { createPublicationService } from "../services/publication.service";
import { ApiError } from "@/services/api.services";

export const useCreatePublication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPublication = async (
    payload: PublicationApiRequest,
    onProgress?: (percentage: number) => void
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createPublicationService(payload, onProgress);
      return result;
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) { //TODO: Cambiar a los codigos de error reales
          setError("No se encontró el recurso solicitado.");
        } else if (err.status === 422) {
          setError("Error de validación en los datos enviados.");
        } else {
          setError(err.message || "Ocurrió un error al crear la publicación.");
        }
      } else {
        setError("Error de conexión, intenta de nuevo.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPublication, isLoading, error };
};

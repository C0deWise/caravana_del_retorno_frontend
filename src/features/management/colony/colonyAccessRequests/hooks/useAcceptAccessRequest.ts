"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/services/api.services";
import type { AccessRequest } from "../types/access-request.types";
import { acceptAccessRequest } from "../services/access-request.service";

interface UseAcceptAccessRequestReturn {
  acceptRequest: (requestId: number) => Promise<AccessRequest>;
  isAccepting: boolean;
  error: string | null;
  reset: () => void;
}

export function useAcceptAccessRequest(): UseAcceptAccessRequestReturn {
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptRequest = useCallback(async (requestId: number) => {
    setIsAccepting(true);
    setError(null);

    try {
      return await acceptAccessRequest(requestId);
    } catch (err) {
      const apiError = err as ApiError;
      switch (apiError.status) {
        case 404:
          setError("Solicitud no encontrada");
          break;
        case 409:
          setError("Solicitud en estado no válido para aceptar");
          break;
        case 422:
          setError("Error de validación");
          break;
        default:
          setError(apiError.message || "Error al aceptar solicitud");
      }
      throw apiError;
    } finally {
      setIsAccepting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsAccepting(false);
  }, []);

  return {
    acceptRequest,
    isAccepting,
    error,
    reset,
  };
}

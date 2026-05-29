"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/services/api.services";
import type { AccessRequest } from "../types/access-request.types";
import { rejectAccessRequest } from "../services/access-request.service";

interface UseRejectAccessRequestReturn {
  rejectRequest: (requestId: number) => Promise<AccessRequest>;
  isRejecting: boolean;
  error: string | null;
  reset: () => void;
}

export function useRejectAccessRequest(): UseRejectAccessRequestReturn {
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rejectRequest = useCallback(async (requestId: number) => {
    setIsRejecting(true);
    setError(null);

    try {
      return await rejectAccessRequest(requestId);
    } catch (err) {
      const apiError = err as ApiError;
      switch (apiError.status) {
        case 404:
          setError("Solicitud no encontrada");
          break;
        case 409:
          setError("Solicitud en estado no válido para rechazar");
          break;
        case 422:
          setError("Error de validación");
          break;
        default:
          setError(apiError.message || "Error al rechazar solicitud");
      }
      throw apiError;
    } finally {
      setIsRejecting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsRejecting(false);
  }, []);

  return {
    rejectRequest,
    isRejecting,
    error,
    reset,
  };
}

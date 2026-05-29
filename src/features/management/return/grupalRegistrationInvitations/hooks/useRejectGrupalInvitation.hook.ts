"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/services/api.services";
import type { GrupalInvitation } from "../types/grupalInscription.types";
import { rejectGrupalInvitation } from "../services/grupalInscription.service";

interface UseRejectGrupalInvitationReturn {
  rejectInvitation: (invitationId: number) => Promise<GrupalInvitation>;
  isRejecting: boolean;
  error: string | null;
  reset: () => void;
}

export function useRejectGrupalInvitation(): UseRejectGrupalInvitationReturn {
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rejectInvitation = useCallback(async (invitationId: number) => {
    setIsRejecting(true);
    setError(null);

    try {
      return await rejectGrupalInvitation(invitationId);
    } catch (err) {
      const apiError = err as ApiError;
      switch (apiError.status) {
        case 404:
          setError("Invitación no encontrada.");
          break;
        case 409:
          setError(
            "No es posible rechazar esta invitación en su estado actual.",
          );
          break;
        case 422:
          setError("Error de validación al rechazar la invitación.");
          break;
        default:
          setError(apiError.message || "Error al rechazar la invitación.");
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
    rejectInvitation,
    isRejecting,
    error,
    reset,
  };
}

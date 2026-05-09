"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/services/api.services";
import type { GrupalInvitation } from "../types/grupalInscription.types";
import { acceptGrupalInvitation } from "../services/grupalInscription.service";

interface UseAcceptGrupalInvitationReturn {
  acceptInvitation: (invitationId: number) => Promise<GrupalInvitation>;
  isAccepting: boolean;
  error: string | null;
  reset: () => void;
}

export function useAcceptGrupalInvitation(): UseAcceptGrupalInvitationReturn {
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptInvitation = useCallback(async (invitationId: number) => {
    setIsAccepting(true);
    setError(null);

    try {
      return await acceptGrupalInvitation(invitationId);
    } catch (err) {
      const apiError = err as ApiError;
      switch (apiError.status) {
        case 404:
          setError("Invitación no encontrada.");
          break;
        case 409:
          setError(
            "No es posible aceptar esta invitación. Es posible que ya pertenezcas a un grupo o que la invitación no esté pendiente.",
          );
          break;
        case 422:
          setError("Error de validación al aceptar la invitación.");
          break;
        default:
          setError(apiError.message || "Error al aceptar la invitación.");
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
    acceptInvitation,
    isAccepting,
    error,
    reset,
  };
}

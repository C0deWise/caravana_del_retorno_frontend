"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/services/api.services";
import type { GrupalInvitation } from "../types/grupalInscription.types";
import { listMyGrupalInvitations } from "../services/grupalInscription.service";

interface UseGrupalInscriptionListReturn {
  invitations: GrupalInvitation[];
  isLoading: boolean;
  error: string | null;
  totalInvitations: number;
  refetch: () => Promise<void>;
  updateInvitationLocally: (updated: GrupalInvitation) => void;
}

export function useGrupalInscriptionList(): UseGrupalInscriptionListReturn {
  const [invitations, setInvitations] = useState<GrupalInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await listMyGrupalInvitations();
      setInvitations(data);
    } catch (err) {
      const apiError = err as ApiError;
      switch (apiError.status) {
        case 404:
          setError(null);
          setInvitations([]);
          break;
        case 422:
          setError("Error de validación al cargar invitaciones.");
          setInvitations([]);
          break;
        default:
          setError(apiError.message || "Error cargando invitaciones");
          setInvitations([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInvitations();
  }, [fetchInvitations]);

  const updateInvitationLocally = useCallback((updated: GrupalInvitation) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === updated.id ? updated : inv)),
    );
  }, []);

  return {
    invitations,
    isLoading,
    error,
    totalInvitations: invitations.length,
    refetch: fetchInvitations,
    updateInvitationLocally,
  };
}

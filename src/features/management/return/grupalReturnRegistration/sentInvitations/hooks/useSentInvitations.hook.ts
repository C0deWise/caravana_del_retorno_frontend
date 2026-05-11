"use client"

import { useCallback, useEffect, useState } from "react";
import { SolicitudMiembro } from "../../types/grupalReturnRegistration"
import { ApiError } from "@/services/api.services";
import { grupalReturnRegistrationService } from "../../services/grupalReturnRegistration.service";

interface UseSentInvitationsReturn {
    invitations: SolicitudMiembro[];
    isLoading: boolean;
    error: string | null;
    hasPending: boolean;
    refetch: () => Promise<void>;
}

export function useSentInvitations(grupoId: number | undefined): UseSentInvitationsReturn {
    const [invitations, setInvitations] = useState<SolicitudMiembro[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInvitations = useCallback(async () => {
        if (!grupoId) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await grupalReturnRegistrationService.getSolicitudes(grupoId);
            setInvitations(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Error al cargar las invitaciones enviadas");
        } finally {
            setIsLoading(false);
        }
    }, [grupoId]);

    useEffect(() => {
        void fetchInvitations();
    }, [fetchInvitations]);

    const hasPending = invitations.some((inv) => inv.estado === "Pendiente");

    return {
        invitations,
        isLoading,
        error,
        hasPending,
        refetch: fetchInvitations,
    }
}

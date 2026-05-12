"use client"

import { useCallback, useEffect, useState } from "react";
import { EntradaInvitacion } from "../../types/grupalReturnRegistration"
import { ApiError } from "@/services/api.services";
import { grupalReturnRegistrationService } from "../../services/grupalReturnRegistration.service";
import { personaService } from "../../externalPerson/services/persona.service";

interface UseSentInvitationsReturn {
    invitations: EntradaInvitacion[];
    isLoading: boolean;
    error: string | null;
    hasPending: boolean;
    refetch: () => Promise<void>;
}

export function useSentInvitations(grupoId: number | undefined): UseSentInvitationsReturn {
    const [invitations, setInvitations] = useState<EntradaInvitacion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInvitations = useCallback(async () => {
        if (!grupoId) return;

        setIsLoading(true);
        setError(null);

        try {
            const [solicitudes, personas] = await Promise.all([
                grupalReturnRegistrationService.getSolicitudes(grupoId),
                personaService.getByGrupo(grupoId),
            ]);

            const combined: EntradaInvitacion[] = [
                ...solicitudes.map((s) => ({ kind: "usuario" as const, data: s })),
                ...personas.map((p) => ({ kind: "persona" as const, data: p })),
            ];

            setInvitations(combined);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Error al cargar las invitaciones enviadas");
        } finally {
            setIsLoading(false);
        }
    }, [grupoId]);

    useEffect(() => {
        void fetchInvitations();
    }, [fetchInvitations]);

    const hasPending = invitations.some(
        (inv) => inv.kind === "usuario" && inv.data.estado.toLowerCase() === "pendiente"
    );

    return {
        invitations,
        isLoading,
        error,
        hasPending,
        refetch: fetchInvitations,
    }
}

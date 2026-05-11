"use client"

import { useCallback, useEffect, useState } from "react";
import { SolicitudMiembro } from "../../types/grupalReturnRegistration"
import { ApiError } from "@/services/api.services";

interface UseSentInvitationsReturn {
    invitations: SolicitudMiembro[];
    isLoading: boolean;
    error: string | null;
    hasPending: boolean;
    refetch: () => Promise<void>;
}

// ── MOCK ──────────────────────────────────────────────────────────────────────
const USE_MOCK = true;

const MOCK_INVITATIONS: SolicitudMiembro[] = [
    {
        id: 1,
        usuarioId: 101,
        grupoId: 1,
        estado: "Pendiente",
        nombreUsuario: "Carlos",
        apellidoUsuario: "Ramírez",
    },
    {
        id: 2,
        usuarioId: 102,
        grupoId: 1,
        estado: "Aceptada",
        nombreUsuario: "Ana",
        apellidoUsuario: "Torres",
    },
    {
        id: 3,
        usuarioId: 103,
        grupoId: 1,
        estado: "Rechazada",   // ← no debe aparecer en la lista
        nombreUsuario: "Luis",
        apellidoUsuario: "Gómez",
    },
];
// ─────────────────────────────────────────────────────────────────────────────

export function useSentInvitations(grupoId: number | undefined): UseSentInvitationsReturn {
    const [invitations, setInvitations] = useState<SolicitudMiembro[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInvitations = useCallback(async () => {
        if (!grupoId) return;

        setIsLoading(true);
        setError(null);

        try {

            if (USE_MOCK) {
                await new Promise((r) => setTimeout(r, 500));
                setInvitations(MOCK_INVITATIONS);
                return;
            }

            //TODO: Conectar cuando el endpoint esté disponible
            // const data = await grupalReturnRegistrationService.getSolicitudes(grupoId);
            // setInvitations(data);

            await Promise.resolve();
            setInvitations([]);
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

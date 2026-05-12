"use client";

import { useCallback, useEffect, useState } from "react";
import { GruposRetorno } from "../types/grupalReturnRegistration";
import { grupalReturnRegistrationService } from "../services/grupalReturnRegistration.service";
import { ApiError } from "@/services/api.services";

interface UseGrupoReturn {
    grupo: GruposRetorno | null;
    isLoading: boolean;
    error: string | null;
    createGrupo: (liderId: number) => Promise<void>;
    isCreating: boolean;
    createError: string | null;
}

export function useGrupo(liderId: number | undefined): UseGrupoReturn {
    const [grupo, setGrupo] = useState<GruposRetorno | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const fetchGrupo = useCallback(async () => {
        if (!liderId) return;

        setIsLoading(true);
        setError(null);

        try {
            const grupos = await grupalReturnRegistrationService.getGruposPorLider(liderId);
            setGrupo(grupos.length > 0 ? grupos[0] : null);
        } catch (err) {
            if (err instanceof ApiError && err.status === 404) {
                setGrupo(null);
            } else {
                setError(err instanceof ApiError ? err.message : "Error al cargar el grupo");
            }
        } finally {
            setIsLoading(false);
        }
    }, [liderId]);

    useEffect(() => {
        void fetchGrupo();
    }, [fetchGrupo]);

    const createGrupo = useCallback(async (id: number) => {
        setIsCreating(true);
        setCreateError(null);

        try {
            const nuevo = await grupalReturnRegistrationService.createGrupo({ lider: id });
            setGrupo(nuevo);
        } catch (err) {
            setCreateError(err instanceof ApiError ? err.message : "Error al crear el grupo");
        } finally {
            setIsCreating(false);
        }
    }, []);

    return { grupo, isLoading, error, createGrupo, isCreating, createError }
}
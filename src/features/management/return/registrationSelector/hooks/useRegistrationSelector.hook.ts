"use client";

import { useAuth } from "@/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import { useGrupo } from "../../grupalReturnRegistration/hooks/useGrupo.hook";
import { useEffect } from "react";

interface UseRegistrationSelectorReturn {
    isLoading: boolean;
    isCreating: boolean;
    error: string | null;
    createError: string | null;
    selectIndividual: () => void;
    selectGrupal: () => Promise<void>;
}

export function useRegistrationSelector(): UseRegistrationSelectorReturn {
    const router = useRouter();
    const { user } = useAuth();
    const { grupo, isLoading, error, createGrupo, isCreating, createError } = useGrupo(user?.id);

    useEffect(() => {
        if (!isLoading && grupo != null) {
            router.replace("/gestion/retorno/registro/grupal");
        }
    }, [isLoading, grupo, router]);

    const selectIndividual = () => {
        router.push("/gestion/retorno/registro/individual");
    };

    const selectGrupal = async () => {
        if (!user) return;
        await createGrupo(user.id);
        router.push("gestion/retorno/registro/grupal");
    };

    return {
        isLoading,
        isCreating,
        error,
        createError,
        selectIndividual,
        selectGrupal,
    };
}
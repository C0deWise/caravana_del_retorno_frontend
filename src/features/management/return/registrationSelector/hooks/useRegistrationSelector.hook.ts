"use client";

import { useAuth } from "@/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import { useGrupo } from "../../grupalReturnRegistration/hooks/useGrupo.hook";
import { useEffect, useState } from "react";
import { retornoService } from "../../services/retorno.service";
import { Retorno } from "@/types/retorno.types";

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
    
    const [activeReturn, setActiveReturn] = useState<Retorno | null>(null);
    const [hasIndividualRegistration, setHasIndividualRegistration] = useState(false);
    const [isCheckingIndividual, setIsCheckingIndividual] = useState(true);

    useEffect(() => {
        if (!user) return;

        let isMounted = true;

        const check = async () => {
            setIsCheckingIndividual(true);

            try {
                const retorno = await retornoService.getActiveReturn();
                if(!isMounted || !retorno) return;
                setActiveReturn(retorno);

                const hasReg = await retornoService.hasUserRegistrationInReturn(user.id, retorno.codigo);
                if (!isMounted) return;
                setHasIndividualRegistration(hasReg);
            } finally {
                if (isMounted) setIsCheckingIndividual(false);
            }
        };

        void check();
        return() => {isMounted = false};
    }, [user]);

    useEffect(() => {
        if (isCheckingIndividual || isLoading) return;

        if (grupo != null) {
            router.replace("/gestion/retorno/registro/grupal");
        } else if (hasIndividualRegistration) {
            router.replace("/gestion/retorno/registro/individual")
        }
    }, [isCheckingIndividual, isLoading, grupo, hasIndividualRegistration, router]);

    const selectIndividual = () => {
        router.push("/gestion/retorno/registro/individual");
    };

    const selectGrupal = async () => {
        if (!user) return;
        await createGrupo(user.id);
        router.push("/gestion/retorno/registro/grupal");
    };

    return {
        isLoading: isLoading || isCheckingIndividual,
        isCreating,
        error,
        createError,
        selectIndividual,
        selectGrupal,
    };
}
"use client"

import { ApiError } from "@/services/api.services";
import { useState } from "react";
import { grupalReturnRegistrationService } from "../services/grupalReturnRegistration.service";

interface UseCancelGroupReturn {
    cancelGroup: (grupoId: number) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export function useCancelGroup(): UseCancelGroupReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancelGroup = async (_grupoId: number): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            await grupalReturnRegistrationService.deleteGroup(_grupoId);
        } catch (err){
            setError(err instanceof ApiError ? err.message : "Error al cancelar el grupo");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        cancelGroup,
        isLoading,
        error
    }
}
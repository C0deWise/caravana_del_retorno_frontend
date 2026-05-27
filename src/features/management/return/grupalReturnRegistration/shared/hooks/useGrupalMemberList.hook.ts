import { useCallback, useEffect, useState } from "react";
import { MiembroGrupo } from "../types/grupalReturnRegistration";
import { grupalReturnRegistrationService } from "../services/grupalReturnRegistration.service";
import { ApiError } from "@/services/api.services";

interface UseGrupalMembersListReturn {
    members: MiembroGrupo[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useGrupalMembersList(grupoId: number | undefined): UseGrupalMembersListReturn {
    const [members, setMembers] = useState<MiembroGrupo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState <string | null>(null);

    const fetchMembers = useCallback(async () => {
        if (!grupoId) return;

        setIsLoading(true);
        setError(null)

        try {
            const data = await grupalReturnRegistrationService.getMiembros(grupoId);
            setMembers(data);
        } catch (err) {
            if (err instanceof ApiError && err.status === 404) {
                setMembers([]);
            } else {
                setError(err instanceof ApiError ? err.message : "Error al cargar los miembros");
            }
        } finally {
            setIsLoading(false);
        }
    }, [grupoId]);

    useEffect(() => {
        void fetchMembers();
    }, [fetchMembers]);

    return {
        members,
        isLoading,
        error,
        refetch: fetchMembers
    };
}
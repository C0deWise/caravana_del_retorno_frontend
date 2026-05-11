"use client"

import { UserSearchResult } from "@/types/user.types"
import { InviteMemberError } from "../types/inviteMember.types";
import { MiembroGrupo } from "../../types/grupalReturnRegistration";
import { useCallback, useState } from "react";
import { returnRegistrationService } from "../../../returnRegistrationForm/services/returnRegistration.service";
import { grupalReturnRegistrationService } from "../../services/grupalReturnRegistration.service";
import { ApiError } from "@/services/api.services";

interface UseInviteMemberReturn {
    inviteMember: (user: UserSearchResult, grupoId: number, activeReturnCode: number | null) => Promise<boolean>;
    isLoading: boolean;
    error: InviteMemberError | null;
    errorMessage: string | null;
    reset: () => void;
}

export function useInviteMember(currentMembers: MiembroGrupo[]): UseInviteMemberReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<InviteMemberError | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const reset = useCallback(() => {
        setError(null);
        setErrorMessage(null);
    }, []);

    const inviteMember = useCallback( async (
        user: UserSearchResult,
        grupoId: number,
        activeReturnCode: number | null,
    ): Promise<boolean> => {
        setIsLoading(true);
        reset();
        try {
            const alreadyInGroup = currentMembers.some((m) => m.id === user.id);
            if (alreadyInGroup) {
                setError("already_in_group");
                setErrorMessage("Este usuario ya pertenece a un grupo");
                return false;
            }

            if (activeReturnCode) {
                const hasIndividualRegistration = await returnRegistrationService.hasUserRegistrationInReturn (user.id, activeReturnCode);
                if (hasIndividualRegistration) {
                    setError("already_registered_individually");
                    setErrorMessage("Este usuario ya tiene un registro individual para este retorno");
                    return false;
                }
            }

            await grupalReturnRegistrationService.solicitarMiembro({ usuarioId: user.id, grupoId });
            return true;
        } catch (err) {
            setError("invite_failed");
            setErrorMessage(err instanceof ApiError ? err.message : "Error al enviar la invitación");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [currentMembers, reset]);

    return {
        inviteMember,
        isLoading,
        error,
        errorMessage,
        reset,
    };
}
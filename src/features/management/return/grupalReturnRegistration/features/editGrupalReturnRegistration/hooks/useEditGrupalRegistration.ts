import { useState } from "react";
import { RegistroGrupoRetorno, RegistroGrupoRetornoRequest } from "../../../shared/types/grupalReturnRegistration";
import { editGrupalRegistration } from "../services/editGrupalReturnRegistration.service";
import { ApiError } from "@/services/api.services";

interface UseEditGrupalRegistrationReturn {
    editRegistration: (data: RegistroGrupoRetornoRequest, registrationId: number) => Promise<RegistroGrupoRetorno | null>;
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

export function useEditGrupalRegistration(): UseEditGrupalRegistrationReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const editRegistration = async (
        data: RegistroGrupoRetornoRequest,
        registrationId: number,
    ): Promise<RegistroGrupoRetorno | null> => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            console.log("Editando inscripción para: ", data);
            const response = await editGrupalRegistration.editGrupalRegistration(registrationId, data);
            setSuccess(true);
            return response;
        } catch (err) {
            const message = err instanceof ApiError ? err.message : "Ha ocurrido un error al editar el registro grupal.";
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { editRegistration, isLoading, error, success };
}

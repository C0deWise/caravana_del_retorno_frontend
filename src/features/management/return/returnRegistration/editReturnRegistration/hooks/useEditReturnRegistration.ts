import { useState } from "react";
import { ReturnRegistrationApi, ReturnRegistrationCreateRequest } from "../../types/returnRegistration.types";
import { returnRegistrationEditService } from "../services/editReturnRegistration.service";
import { ApiError } from "@/services/api.services";

interface UseReturnRegistrationEditReturn {
    editReturnRegistration: (data: ReturnRegistrationCreateRequest, registrationId: number) => Promise<ReturnRegistrationApi | null>;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export const useReturnRegistrationEdit = (): UseReturnRegistrationEditReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const editReturnRegistration = async (
        data: ReturnRegistrationCreateRequest,
        registrationId: number
    ): Promise<ReturnRegistrationApi | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await returnRegistrationEditService.editRegistration(data, registrationId);
            setSuccess(true);
            return response;
        } catch (err) {
            const message = err instanceof ApiError ? err.message : "Ha ocurrido un error al realizar la edición del registro.";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };
    
    return {
        editReturnRegistration,
        loading,
        error,
        success,
    }
}
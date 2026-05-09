import { useState } from "react";
import { returnUnregistrationService } from  "../service/returnUnregistration.service";
import type { ReturnUnregistrationApi, ReturnUnregistrationCreateRequest } from "../types/returnUnregistration.types";

interface UseSendReturnUnregistration {
    sendReturnUnregistration:(data: ReturnUnregistrationCreateRequest) => Promise<ReturnUnregistrationApi | null>;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export const useSendReturnUnregistration = (): UseSendReturnUnregistration => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const sendReturnUnregistration = async (data: ReturnUnregistrationCreateRequest): Promise<ReturnUnregistrationApi | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await returnUnregistrationService.deleteReturnRegistration(data);
            setSuccess(true);
            return response;
        }
        catch (error) {
            const mensaje =
                error instanceof Error ? error.message : "Error al enviar la desinscripción de retorno";
            setError(mensaje);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        sendReturnUnregistration,
        loading,
        error,
        success,
    };
}
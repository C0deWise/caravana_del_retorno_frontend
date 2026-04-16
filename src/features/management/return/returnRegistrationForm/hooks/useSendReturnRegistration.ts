import { useState } from "react";
import { returnRegistrationService } from "../services/returnRegistration.service";
import type { ReturnRegistrationApi, ReturnRegistrationItem } from "../types/returnRegistration.types";

interface UseSendReturnRegistration {
    sendReturnRegistration:(data: ReturnRegistrationItem) => Promise<ReturnRegistrationApi | null>;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export const useSendReturnRegistration = (): UseSendReturnRegistration => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const sendReturnRegistration = async (data: ReturnRegistrationItem): Promise<ReturnRegistrationApi | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await returnRegistrationService.createReturnRegistration(data);
            setSuccess(true);
            return response;
        } catch (error) {
            const mensaje =
                error instanceof Error ? error.message : "Error al enviar el registro de retorno";
            setError(mensaje);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        sendReturnRegistration,
        loading,
        error,
        success,
    };
};
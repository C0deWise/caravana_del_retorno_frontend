import { useEffect, useState } from "react";
import { ReturnRegistrationApi } from "../../types/returnRegistration.types";
import { returnRegistrationEditService } from "../services/editReturnRegistration.service";
import { ApiError } from "@/services/api.services";

interface UseLoadReturnRegistrationReturn {
    registration: ReturnRegistrationApi | null;
    loading: boolean;
    error: string | null;
}

export const useLoadReturnRegistration = (userId: number, returnId: number): UseLoadReturnRegistrationReturn => {
    const [registration, setRegistration] = useState<ReturnRegistrationApi | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect (() => {
        const fetchRegistration = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await returnRegistrationEditService.getRegistration(userId, returnId);
                setRegistration(response);
            } catch (err) {
                const message = err instanceof ApiError ? err.message : "Error al cargar el registro del Retorno";
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistration();
    }, [userId, returnId]);

    return {
        registration,
        loading,
        error,
    };
}
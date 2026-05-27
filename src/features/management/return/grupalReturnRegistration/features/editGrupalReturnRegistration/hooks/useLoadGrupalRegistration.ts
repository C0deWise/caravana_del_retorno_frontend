import { useEffect, useState } from "react";
import { RegistroGrupoRetorno } from "../../../shared/types/grupalReturnRegistration";
import { editGrupalRegistration } from "../services/editGrupalReturnRegistration.service";
import { ApiError } from "@/services/api.services";

interface UseLoadGrupalRegistrationReturn {
    registration: RegistroGrupoRetorno | null;
    loading: boolean;
    error: string | null;
}

export function useLoadGrupalRegistration(groupId: number, returnId: number): UseLoadGrupalRegistrationReturn {
    const [registration, setRegistration] = useState<RegistroGrupoRetorno | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!groupId || !returnId) return;

        const fetchRegistration = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await editGrupalRegistration.getGrupalRegistration(groupId, returnId);
                setRegistration(response);
            } catch (err) {
                if (err instanceof ApiError && err.status === 404) {
                    setRegistration(null);
                } else {
                    const message = err instanceof ApiError ? err.message : "Error al cargar el registro grupal del Retorno";
                    setError(message);
                }
            } finally {
                setLoading(false);
            }
        };
        void fetchRegistration();
    }, [groupId, returnId]);

    return { registration, loading, error };
}

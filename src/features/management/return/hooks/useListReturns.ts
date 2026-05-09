import { useCallback, useEffect, useState } from "react";
import { Retorno } from "../types/retorno.types";
import { retornoService } from "../services/retorno.service";
import { ApiError } from "@/services/api.services";

interface UseListReturnReturn {
    listReturns: () => Promise<Retorno[] | null>;
    refetch: () => Promise<Retorno[] | null>;
    returns: Retorno[];
    loading: boolean;
    error: string | null;  
}

export const useListReturn = (autoFetch = false): UseListReturnReturn => {
    const [returns, setReturns] = useState<Retorno[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listReturns = useCallback(async (): Promise<Retorno[] | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await retornoService.getReturns();
            setReturns(response);
            return response;
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Error al cargar los retornos");
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if(autoFetch) {
            void listReturns();
        }
    }, [autoFetch, listReturns]);

    return {
        listReturns,
        refetch: listReturns,
        returns,
        loading, 
        error
    };
};
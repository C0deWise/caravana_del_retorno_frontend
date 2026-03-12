import { useCallback, useState } from 'react';
import { coloniaService } from '../services/colonia.service';
import type {
    ColoniaItem,
    ColoniaResponse
} from '../types/colonia.types';

interface UseListColoniaReturn {
    listColonia: () => Promise<ColoniaResponse<ColoniaItem[]> | null>;
    loading: boolean;
    error: string | null;
}

export const useListColonia = (): UseListColoniaReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listColonia = useCallback(async (): Promise<ColoniaResponse<ColoniaItem[]> | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await coloniaService.getColonias();
            if (!response.success) {
                setError(response.message || 'Error al listar las colonias');
                return null;
            }

            return response;
        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error al listar las colonias';
            setError(mensaje);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        listColonia,
        loading,
        error
    };
}
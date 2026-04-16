import { useState } from 'react';
import { retornoService } from '../services/retorno.service';
import type {
    RetornoData,
    RetornoResponse
} from '../types/retorno.types';

interface UseCreateRetornoReturn {
    createRetorno: (data: RetornoData) => Promise<RetornoResponse | null>;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export const useCreateRetorno = (): UseCreateRetornoReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createRetorno = async (data: RetornoData): Promise<RetornoResponse | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validar que la fecha no esté vacía
            if (!data.re_fecha_creacion) {
                setError('La fecha es obligatoria');
                return null;
            }

            const response = await retornoService.createRetorno(data);
            
            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.message || 'Error al crear el retorno');
            }
            
            return response;

        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error al crear el retorno';
            setError(mensaje);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createRetorno,
        loading,
        error,
        success
    };
};

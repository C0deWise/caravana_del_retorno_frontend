import { useState } from 'react';
import { coloniaService } from '../services/colonia.service';
import type {
    ColoniaData,
    ColoniaResponse
} from '../types/colonia.types';

interface UseCreateColoniaReturn {
    createColonia: (data: ColoniaData) => Promise<ColoniaResponse | null>;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export const useCreateColonia = (): UseCreateColoniaReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createColonia = async (data: ColoniaData): Promise<ColoniaResponse | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validar que los campos no estén vacíos
            if (!data.co_pais || !data.co_departamento || !data.co_ciudad) {
                setError('Todos los campos son obligatorios');
                return null;
            }

            const response = await coloniaService.createColonia(data);
            
            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.message || 'Error al crear la colonia');
            }
            
            return response;

        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error al crear la colonia';
            setError(mensaje);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createColonia,
        loading,
        error,
        success
    };
};

import { useState } from 'react';
import { userService } from '@/shared/services/user/user.services';
import type { UserData, UserResponse } from '@/types/user.types';

interface UseInscribirUsuarioColoniaReturn {
    inscribirUsuarioColonia: (data: UserData) => Promise<UserResponse | null>;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export const useInscribirUsuarioColonia = (): UseInscribirUsuarioColoniaReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const inscribirUsuarioColonia = async (data: UserData): Promise<UserResponse | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validar que los campos no estén vacíos
            if (!data.id || !data.documentType || !data.documentNumber || !data.phone || !data.colonyId || !data.firstName || !data.lastName || !data.gender || !data.birthDate || !data.country) {
                setError('Todos los campos son obligatorios');
                return null;
            }

            const response = await userService.createUser(data);

            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.message || 'Error al inscribir el usuario en la colonia');
            }

            return response;
        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error al inscribir el usuario en la colonia';
            setError(mensaje);
            return null;
        } finally {
            setLoading(false);
        }
    };
    return {
        inscribirUsuarioColonia,
        loading,
        error,
        success
    }
}
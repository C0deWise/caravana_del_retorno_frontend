import { useState } from 'react';
import { userService } from '../../../../shared/services/user/user.services';
import type { UserData, UserResponse } from '../../../../shared/types/user/user.types';

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
            if (!data.us_codigo || !data.us_tipo_doc || !data.us_documento || !data.us_celular || !data.co_codigo || !data.us_nombre || !data.us_apellido || !data.us_genero || !data.us_fecha_nacimiento || !data.us_pais) {
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
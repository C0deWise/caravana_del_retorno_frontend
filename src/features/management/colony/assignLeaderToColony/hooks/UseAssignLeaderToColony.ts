import { useState } from "react";
import { userService } from "../../../../../shared/services/user/user.services";
import { UserData, UserResponse } from "../../../../../shared/types/user/user.types";

interface UseAssignLeaderToColonyReturn {
    assignLeader: (userData: UserData) => Promise<UserResponse | null>;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export const useAssignLeaderToColony = (): UseAssignLeaderToColonyReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const assignLeader = async (data: UserData): Promise<UserResponse | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validar que el rol no esté vacío
            if (!data.rol) {
                setError('El campo rol es obligatorio');
                return null;
            }

            const response = await userService.patchUser(data.codigo, { rol: data.rol });
            
            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.message || 'Error al asignar el líder a la colonia');
            }

            return response;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al asignar el líder a la colonia';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { 
        assignLeader,
        loading,
        error,
        success
    }
}
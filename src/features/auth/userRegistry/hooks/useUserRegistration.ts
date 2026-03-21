import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registrationService } from '../services/registro.service';
import type {
    RegistrationData,
    RegistrationResponse
} from '../types/registro.types';
import { validateRegistrationData } from '../utils/registrationValidation';

interface UseRegisterUserReturn {
    registerUser: (data: RegistrationData) => Promise<RegistrationResponse | null>;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export const useRegisterUser = (): UseRegisterUserReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const registerUser = async (data: RegistrationData): Promise<RegistrationResponse | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const validationErrors = validateRegistrationData(data);
            if (Object.keys(validationErrors).length > 0) {
                const firstError = Object.values(validationErrors)[0] ?? 'Datos de registro inválidos';
                setError(firstError);
                return null;
            }

            const response = await registrationService.userRegistration(data);
            
            if (response.success) {
                setSuccess(true);
                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(response.message || 'Error al registrar usuario');
            }
            
            return response;

        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error al registrar usuario';
            setError(mensaje);
            return null;
        } finally {
            setLoading(false);
        }
    };
    return {
        registerUser,
        loading,
        error,
        success
    };
};
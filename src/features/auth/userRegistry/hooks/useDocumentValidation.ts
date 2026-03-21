import { useState, useCallback } from 'react';
import { registrationService } from '../services/registro.service';
import { validateDocumentByType } from '../utils/registrationValidation';

interface UseDocumentValidationReturn {
    validate: (documentType: string, documentNumber: string) => Promise<boolean>;
    validating: boolean;
    validationError: string | null;
}

/**
 * Hook para validar si un documento ya está registrado en el sistema
 */
export const useDocumentValidation = (): UseDocumentValidationReturn => {
    const [validating, setValidating] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const validate = useCallback(async (documentType: string, documentNumber: string): Promise<boolean> => {
        const documentError = validateDocumentByType(documentType, documentNumber);
        if (documentError) {
            setValidationError(documentError);
            return false;
        }

        setValidating(true);
        setValidationError(null);

        try {
            const result = await registrationService.validateDocument(documentType, documentNumber);

            if (!result.valido) {
                setValidationError(result.mensaje || 'Documento ya registrado');
                return false;
            }

            return true;
        } catch (err) {
            const mensaje = err instanceof Error ? err.message : 'Error al validar documento';
            setValidationError(mensaje);
            return false;
        } finally {
            setValidating(false);
        }
    }, []);

    return {
        validate,
        validating,
        validationError,
    };
};

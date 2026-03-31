import { apiService } from '@/services/api.services';
import type { ReturnRegistrationItem, ReturnRegistrationApi} from '../types/returnRegistration.types';
import type { Retorno } from '../../types/retorno.types';

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
const MOCK_HAS_ACTIVE_RETURN = process.env.NEXT_PUBLIC_MOCK_HAS_ACTIVE_RETURN !== 'false';
const MOCK_ALREADY_REGISTERED = process.env.NEXT_PUBLIC_MOCK_ALREADY_REGISTERED === 'true';
const MOCK_RETURN_CODE = Number(process.env.NEXT_PUBLIC_MOCK_RETURN_CODE ?? 55);
const MOCK_USER_CODE = Number(process.env.NEXT_PUBLIC_MOCK_USER_ID ?? 101);
const mockRegistrationKey = `${MOCK_USER_CODE}-${MOCK_RETURN_CODE}`;
const mockRegisteredUsers = new Set<string>(
    MOCK_ALREADY_REGISTERED ? [mockRegistrationKey] : [],
);

const mockActiveReturn: Retorno = {
    re_codigo: String(MOCK_RETURN_CODE),
    re_fecha_creacion: '2026-01-01T00:00:00.000Z',
    re_año: 2026,
    re_estado: 'activo',
};

const ACTIVE_RETURN_STATES = new Set([
    'activo',
    'active',
    'habilitado',
    'abierto',
    'vigente',
]);

function hasActiveState(state: string | undefined): boolean {
    if (!state) return true;
    return ACTIVE_RETURN_STATES.has(state.trim().toLowerCase());
}

function normalizeRegistrationList(
    response: ReturnRegistrationApi | ReturnRegistrationApi[] | { data?: ReturnRegistrationApi[] },
): ReturnRegistrationApi[] {
    if (Array.isArray(response)) return response;
    if (response && 'data' in response && Array.isArray(response.data)) return response.data;
    if (response && 'id' in response) return [response];
    return [];
}

/**
 * Servicio para manejar las operaciones de gestión de registros del Retorno.
 */

export const returnRegistrationService = {

    /**
     * Obtiene el retorno activo habilitado para registro.
     * Devuelve null cuando no existe un retorno activo disponible.
     */
    getActiveReturn: async (): Promise<Retorno | null> => {

        // Datos mock --> Eliminar tras probar con la API real
        if (USE_MOCKS) {
            return MOCK_HAS_ACTIVE_RETURN ? { ...mockActiveReturn } : null;
        }

        // ------------------------------------------------

        try {
            const response = await apiService.get<Retorno | Retorno[]>('/retornos');

            if (Array.isArray(response)) {
                const activeReturn = response.find((item) => hasActiveState(item.re_estado));
                return activeReturn ?? null;
            }

            if (!response) return null;
            return hasActiveState(response.re_estado) ? response : null;
        } catch (error) {
            console.error('Error en getActiveReturn:', error);
            throw error;
        }
    },

    /**
     * Valida si un usuario ya registró el formulario para un retorno específico.
     */
    hasUserRegistrationInReturn: async (
        userCode: number,
        returnCode: number,
    ): Promise<boolean> => {

        if (USE_MOCKS) {
            return mockRegisteredUsers.has(`${userCode}-${returnCode}`);
        }

        const queryEndpoint = `/return-registrations?user_code=${userCode}&return_code=${returnCode}`;

        try {
            const filteredResponse = await apiService.get<
                ReturnRegistrationApi | ReturnRegistrationApi[] | { data?: ReturnRegistrationApi[] }
            >(queryEndpoint);

            const filteredList = normalizeRegistrationList(filteredResponse);
            if (filteredList.length > 0) return true;
        } catch {
            // Fallback: algunos backends no soportan filtros por querystring.
        }

        try {
            const allResponse = await apiService.get<
                ReturnRegistrationApi | ReturnRegistrationApi[] | { data?: ReturnRegistrationApi[] }
            >('/return-registrations');

            const allRegistrations = normalizeRegistrationList(allResponse);
            return allRegistrations.some(
                (registration) =>
                    registration.user_code === userCode &&
                    registration.return_code === returnCode,
            );
        } catch (error) {
            console.error('Error en hasUserRegistrationInReturn:', error);
            throw error;
        }
    },

    /**
     * Crea un nuevo registro de retorno en el sistema.
     * @param data Información del registro de retorno a crear, excluyendo campos generados automáticamente como id, user_code y return_code.
     * @returns Retorna el registro de retorno creado, incluyendo los campos generados automáticamente.
     */
    createReturnRegistration: async (data: ReturnRegistrationItem): Promise <ReturnRegistrationApi> => {
        
        // Datos mock --> Eliminar tras probar con la API real
        if (USE_MOCKS) {
            if (mockRegisteredUsers.has(mockRegistrationKey)) {
                throw new Error('Ya registraste el formulario para el retorno activo.');
            }

            mockRegisteredUsers.add(mockRegistrationKey);

            return {
                id: Date.now(),
                user_code: MOCK_USER_CODE,
                return_code: MOCK_RETURN_CODE,
                accomodation: data.accomodation,
                transport: data.transport,
                people_in_charge: data.people_in_charge,
            };
        }
        // ------------------------------------------------

        try {
            const response = await apiService.post<ReturnRegistrationApi>("/return-registrations", data);
            return response;
        } catch (error) {
            console.error("Error en createReturnRegistration:", error);
            throw error;
        }
    },
}
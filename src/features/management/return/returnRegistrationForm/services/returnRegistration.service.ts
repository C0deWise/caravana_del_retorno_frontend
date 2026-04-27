import { apiService } from '@/services/api.services';
import type { ReturnRegistrationApi, ReturnRegistrationCreateRequest } from '../types/returnRegistration.types';
import type { Retorno } from '../../types/retorno.types';

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

class ReturnRegistrationService {
    private readonly registroEndpoint = '/api/v1/retornos/registro';
    private readonly retornosEndpoint = '/api/v1/retornos/';

    /**
     * Obtiene el retorno activo habilitado para registro.
     * Devuelve null cuando no existe un retorno activo disponible.
     */
    async getActiveReturn(): Promise<Retorno | null> {
        const response = await apiService.get<Retorno | Retorno[]>(this.retornosEndpoint);

        const list = Array.isArray(response) ? response : response ? [response] : [];
        const activeReturns = list.filter((item) => hasActiveState(item.estado));

        if (activeReturns.length === 0) return null;

        return activeReturns.reduce((latest, current) =>
            current.anio > latest.anio ? current : latest,
        );
    }

    /**
     * Valida si un usuario ya registró el formulario para un retorno específico.
     * TODO: implementar cuando el endpoint esté disponible en el back.
     */
    async hasUserRegistrationInReturn(_userCode: number, _returnCode: number): Promise<boolean> {
        return false;

        // const response = await apiService.get<ReturnRegistrationApi | ReturnRegistrationApi[]>(
        //     `${this.registroEndpoint}?usuario=${_userCode}&retorno=${_returnCode}`,
        // );
        // if (Array.isArray(response)) return response.length > 0;
        // return !!response;
    }

    /**
     * Crea un nuevo registro de retorno en el sistema.
     */
    async createReturnRegistration(data: ReturnRegistrationCreateRequest): Promise<ReturnRegistrationApi> {
        return apiService.post<ReturnRegistrationApi>(this.registroEndpoint, data);
    }
}

export const returnRegistrationService = new ReturnRegistrationService();

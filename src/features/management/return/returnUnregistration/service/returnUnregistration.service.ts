import { apiService } from '@/services/api.services';
import type { ReturnUnregistrationApi, ReturnUnregistrationCreateRequest } from '../types/returnUnregistration.types';
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

class ReturnUnregistrationService {
    private readonly registroEndpoint = '/api/v1/retornos/cancelar-inscripcion/';
    private readonly retornosEndpoint = '/api/v1/retornos/';

    /**
     * Obtiene el retorno activo más reciente disponible.
     * Devuelve null si no hay ningún retorno en estado activo.
     */
    async getActiveReturn(): Promise<Retorno | null> {
        const response = await apiService.get<Retorno | Retorno[]>(this.retornosEndpoint);
        const list = ([] as Retorno[]).concat(response ?? []);
        const activeReturns = list.filter((item) => hasActiveState(item.estado));
        if (activeReturns.length === 0) return null;
        return activeReturns.reduce((latest, current) =>
            current.anio > latest.anio ? current : latest,
        activeReturns[0]);
    }

    /** Obtiene el retorno activo asociado al usuario
     * @param retornoId - El ID del retorno a verificar.
     * @returns Una promesa que se resuelve con el retorno si está activo, o se rechaza con un error si no lo está.
    */
    async getRetornoById(retornoId: number): Promise<Retorno> {
        const retorno = await apiService.get<Retorno>(`${this.retornosEndpoint}${retornoId}/`);
        if (!hasActiveState(retorno.estado)) {
            throw new Error(`El retorno con ID ${retornoId} no está en un estado activo.`);
        }
        return retorno;
    }

    /**
     * Elimina la inscripción de un usuario de un retorno específico, siempre y cuando el retorno esté en un estado activo.
     * @param data - Objeto que contiene el ID del usuario y el ID del retorno.
     * @returns Una promesa que se resuelve con la respuesta de la API o se rechaza con un error.
     */
    async deleteReturnRegistration(data: ReturnUnregistrationCreateRequest): Promise<ReturnUnregistrationApi> {
        // Reemplazar mock cuando el endpoint esté disponible
        // return apiService.post<ReturnUnregistrationApi>(this.registroEndpoint, data);
        return ({ usuario: data.usuario, retorno: data.retorno });
    }
}

export const returnUnregistrationService = new ReturnUnregistrationService();

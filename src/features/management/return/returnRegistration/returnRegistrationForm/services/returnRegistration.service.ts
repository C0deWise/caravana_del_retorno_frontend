import { apiService } from '@/services/api.services';
import type { ReturnRegistrationApi, ReturnRegistrationCreateRequest } from '../../types/returnRegistration.types';



class ReturnRegistrationService {
    private readonly registroEndpoint = '/api/v1/retornos/registro';
    private readonly retornosEndpoint = '/api/v1/retornos/';

    /**
     * Crea un nuevo registro de retorno en el sistema.
     */
    async createReturnRegistration(data: ReturnRegistrationCreateRequest): Promise<ReturnRegistrationApi> {
        return apiService.post<ReturnRegistrationApi>(this.registroEndpoint, data);
    }
}

export const returnRegistrationService = new ReturnRegistrationService();

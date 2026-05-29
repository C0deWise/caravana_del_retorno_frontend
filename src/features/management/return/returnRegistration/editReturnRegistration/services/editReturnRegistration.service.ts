import { apiService } from "@/services/api.services"
import { ReturnRegistrationApi, ReturnRegistrationCreateRequest } from "../../types/returnRegistration.types"

class ReturnRegistrationEditService {

    private readonly endpoint = "/api/v1/retornos/";

    async getRegistration(userId: number, returnId: number): Promise<ReturnRegistrationApi | null> {
        const response = await apiService.get<ReturnRegistrationApi>(`${this.endpoint}registro/usuario/${userId}/retorno/${returnId}`);
        if (!response) return null;
        return response;
    }

    async editRegistration(data: ReturnRegistrationCreateRequest, registrationId: number): Promise<ReturnRegistrationApi> {
        return apiService.put<ReturnRegistrationApi>(`${this.endpoint}editar-registro/${registrationId}`, data);
    }
}

export const returnRegistrationEditService = new ReturnRegistrationEditService();
import { apiService } from "@/services/api.services";
import { RegistroGrupoRetorno, RegistroGrupoRetornoRequest } from "../../../shared/types/grupalReturnRegistration";

class EditGrupalReturnRegistrationService {
    private readonly endpoint = "/api/v1/grupoRetorno/registro";

    async getGrupalRegistration(groupId: number, returnId: number): Promise<RegistroGrupoRetorno | null> {
        const response = await apiService.get<RegistroGrupoRetorno>(`${this.endpoint}/${groupId}/${returnId}`);
        if (!response) return null;
        return response;
    }

    async editGrupalRegistration(registrationId: number, data: RegistroGrupoRetornoRequest): Promise<RegistroGrupoRetorno> {
        return apiService.patch<RegistroGrupoRetorno>(`${this.endpoint}/${registrationId}`, data);
    }
}

export const editGrupalRegistration = new EditGrupalReturnRegistrationService();
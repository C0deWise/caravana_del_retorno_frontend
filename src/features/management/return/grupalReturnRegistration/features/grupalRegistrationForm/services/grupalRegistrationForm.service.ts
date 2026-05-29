import { apiService } from "@/services/api.services";
import { GruposRetorno } from "../../../shared/types/grupalReturnRegistration";

class EditGrupalRegistrationFormService {
    async getGrupalRegistration(groupId: number, returnId: number): Promise<GruposRetorno> {
        return apiService.get<GruposRetorno>(`/api/v1/grupoRetorno/registro/${groupId}/${returnId}`);
    }
}

export const editGrupalRegistrationFormService = new EditGrupalRegistrationFormService();
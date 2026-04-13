import { apiService } from "@/services/api.services";
import type {
  RegistrationRequest,
  RegistrationResponse,
} from "../types/registro.types";

export const registrationService = {
  userRegistration: async (
    data: RegistrationRequest,
  ): Promise<RegistrationResponse> => {
    return apiService.post("/api/v1/usuario/registrar", data);
  },
};

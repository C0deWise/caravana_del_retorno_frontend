import { apiService } from "@/services/api.services";

interface SignupColonyRequest {
  codigo_usuario: number;
  codigo_colonia: number;
}

export const signupColonyService = {
  crearSolicitud: async (data: SignupColonyRequest): Promise<void> => {
    await apiService.post("/api/v1/colonias/crear-solicitud", data);
  },
};

import { apiService } from "@/services/api.services";
import type { RetornoData, RetornoResponse } from "../types/retorno.types";

/**
 * Servicio para manejar las operaciones de gestión de retornos.
 * Incluye funciones para crear y gestionar retornos.
 */
export const retornoService = {
  createRetorno: async (data: RetornoData): Promise<RetornoResponse> => {
    try {
      const response = await apiService.post<RetornoResponse>(
        "/retornos",
        data,
      );
      return response;
    } catch (error) {
      console.error("Error en createRetorno:", error);
      throw error;
    }
  },

  getRetornos: async (): Promise<RetornoResponse> => {
    try {
      const response = await apiService.get<RetornoResponse>("/retornos");
      return response;
    } catch (error) {
      console.error("Error en getRetornos:", error);
      throw error;
    }
  },
};

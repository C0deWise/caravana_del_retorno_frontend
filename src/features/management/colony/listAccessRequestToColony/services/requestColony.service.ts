import { apiService } from "@/services/api.services";
import type { Request } from "../types/request.types";

/**
 * Servicio para manejar las operaciones relacionadas con las solicitudes de acceso a colonias.
 * Incluye funciones para obtener, aprobar y rechazar solicitudes de acceso.
 */
export const requestColonyService = {
  getAccessRequest: async (coloniaId: number): Promise<Request[]> => {
    try {
      const response = await apiService.get<Request[]>(
        `/colonias/${coloniaId}/requests`,
      );
      return response;
    } catch (error) {
      console.error("Error en getAccessRequest:", error);
      throw error;
    }
  },

  approveRequest: async (data: Request): Promise<void> => {
    try {
      await apiService.post<Request>(`/requests/${data.requestId}`, data);
    } catch (error) {
      console.error("Error en approveRequest:", error);
      throw error;
    }
  },

  rejectRequest: async (data: Request): Promise<void> => {
    try {
      await apiService.post<Request>(`/requests/${data.requestId}`, data);
    } catch (error) {
      console.error("Error en rejectRequest:", error);
      throw error;
    }
  },
};

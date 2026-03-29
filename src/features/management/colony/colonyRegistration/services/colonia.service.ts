import { apiService } from "@/services/api.services";
import type { ColonyData, ColonyApi } from "@/types/colony.types";

/**
 * Servicio para manejar las operaciones de gestión de colonias.
 * Incluye funciones para crear y gestionar colonias.
 */
export const coloniaService = {
  createColonia: async (data: ColonyData): Promise<ColonyApi> => {
    try {
      const response = await apiService.post<ColonyApi>("/colonias", data);
      return response;
    } catch (error) {
      console.error("Error en createColonia:", error);
      throw error;
    }
  },

  getColonias: async (): Promise<ColonyApi[]> => {
    try {
      const response = await apiService.get<ColonyApi[]>("/colonias");
      return response;
    } catch (error) {
      console.error("Error en getColonias:", error);
      throw error;
    }
  },
};

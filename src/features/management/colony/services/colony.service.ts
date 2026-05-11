import { apiService } from "@/services/api.services";
import type { ColonyData, ColonyApi } from "@/types/colony.types";

export const coloniaService = {
  getColonias: async (): Promise<ColonyData[]> => {
    const response = await apiService.get<ColonyApi[]>("/api/v1/colonias/colonias-activas/");
    return response.map((colony) => ({
      ...colony,
      lider: colony.lider ?? 0,
    }));
  },
  getColonyById: async (codigo: number): Promise<ColonyData> => {
    const response = await apiService.get<ColonyApi>(`/api/v1/colonias/${codigo}/`);
    return {
      ...response,
      lider: response.lider ?? 0,
    };
  },
};

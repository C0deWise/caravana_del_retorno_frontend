import { apiService } from "@/services/api.services";
import type { ColonyData, ColonyApi } from "@/types/colony.types";

export const coloniaService = {
  createColony: async (data: ColonyData): Promise<ColonyApi> => {
    const response = await apiService.post<ColonyApi>("/api/v1/colonias/", {
      pais: data.pais,
      departamento: data.departamento,
      ciudad: data.ciudad,
      lider: 0,
    });
    return response;
  },
};

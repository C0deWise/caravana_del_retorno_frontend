import { apiService } from "@/services/api.services";
import type { ColonyApi, ColonyData } from "@/types/colony.types";

const mapColonyApiToItem = (colony: ColonyApi): ColonyData => ({
  codigo: colony.co_codigo,
  pais: colony.co_pais,
  departamento: colony.co_departamento,
  ciudad: colony.co_ciudad,
  lider: colony.lider,
});

export const coloniaService = {
  getColonias: async (): Promise<ColonyData[]> => {
    const response = await apiService.get<ColonyApi[]>("/api/v1/colonias/");
    return response.map(mapColonyApiToItem);
  },
};

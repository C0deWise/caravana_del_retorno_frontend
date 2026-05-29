import { apiService, ApiError } from "@/services/api.services";
import type { ColonyData, ColonyApi } from "@/types/colony.types";

export const coloniaService = {
  createColony: async (data: ColonyData): Promise<ColonyApi> => {
    try {
      const response = await apiService.post<ColonyApi>("/api/v1/colonias/", {
        pais: data.pais,
        departamento: data.departamento,
        ciudad: data.ciudad,
      });
      return response;
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        try {
          const allColonias = await apiService.get<ColonyApi[]>("/api/v1/colonias/");
          const existing = allColonias.find((c) =>
            c.pais === data.pais &&
            c.departamento === data.departamento &&
            c.ciudad === data.ciudad
          );

          if (existing && existing.estado?.toLowerCase() === "inactiva") {
            await apiService.patch(`/api/v1/colonias/toggle-estado/${existing.codigo}/`, {});
            return { ...existing, estado: "activa" };
          }
        } catch (e) {
          console.error("Error consultando colonias durante conflicto 409:", e);
        }
        throw error;
      }
      throw error;
    }
  },
};

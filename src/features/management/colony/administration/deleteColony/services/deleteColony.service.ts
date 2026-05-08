import { apiService } from "@/services/api.services";

export const deleteColonyService = {
  deleteColony: async (id: number): Promise<void> => {
    await apiService.delete(`/api/v1/colonias/${id}/`); // TODO: Cambiar a la ruta correcta cuando la api este disponible
  },
};

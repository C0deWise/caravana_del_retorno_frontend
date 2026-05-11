import { apiService } from "@/services/api.services";

export const deleteColonyService = {
  deleteColony: async (id: number): Promise<void> => {
    await apiService.patch(`/api/v1/colonias/desactivar/${id}/`, {});
  },
};

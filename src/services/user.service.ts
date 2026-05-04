import { apiService } from "@/services/api.services";
import type { UserSearchResult } from "@/types/user.types";

export const userService = {
  getUserById: async (id: number): Promise<UserSearchResult> => {
    return apiService.get(`/api/v1/usuario/${id}`);
  },

  searchByName: async (nombre: string): Promise<UserSearchResult[]> => {
    return apiService.get(
      `/api/v1/usuario/buscar/${encodeURIComponent(nombre)}`,
    );
  },

  searchByDocument: async (documento: string): Promise<UserSearchResult> => {
    return apiService.get(`/api/v1/usuario/buscar_documento/${documento}`);
  },

  createSearchFn: (
    mode: string,
    value: string,
  ): Promise<UserSearchResult[]> => {
    if (mode === "nombre") {
      return userService.searchByName(value);
    }
    return userService.searchByDocument(value).then((user) => [user]);
  },
};



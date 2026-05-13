import { apiService, ApiError } from "@/services/api.services";
import type { UserSearchResult } from "@/types/user.types";

export const userService = {
  getUserById: async (id: number): Promise<UserSearchResult> => {
    return apiService.get(`/api/v1/usuario/buscar_id/${id}/`);
  },

  searchByName: async (nombre: string): Promise<UserSearchResult[]> => {
    return apiService.get(
      `/api/v1/usuario/buscar/${encodeURIComponent(nombre)}`,
    );
  },

  searchByDocument: async (documento: string): Promise<UserSearchResult> => {
    return apiService.get(`/api/v1/usuario/buscar_documento/${documento}`);
  },

  safeSearchByDocument: async (documento: string): Promise<UserSearchResult[]> => {
    try {
      const user = await userService.searchByDocument(documento);
      return user ? [user] : [];
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return [];
      throw err;
    }
  },

  createSearchFn: async (
    mode: string,
    value: string,
  ): Promise<UserSearchResult[]> => {
    const trimmed = value.trim();

    if (mode === "nombre") {
      return userService.searchByName(trimmed);
    }

    if (mode === "documento") {
      return userService.safeSearchByDocument(trimmed);
    }

    return /^\d+$/.test(trimmed)
      ? userService.safeSearchByDocument(trimmed)
      : userService.searchByName(trimmed);
  },
};



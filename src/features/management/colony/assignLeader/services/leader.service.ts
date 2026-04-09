import { apiService } from "@/services/api.services";
import type {
  UserSearchResult,
  SetLeaderRequest,
  SetLeaderResponse,
} from "../types/leader.types";

export const leaderService = {
  searchByName: async (nombre: string): Promise<UserSearchResult[]> => {
    return apiService.get(
      `/api/v1/usuario/buscar/${encodeURIComponent(nombre)}`,
    );
  },

  searchByDocument: async (documento: string): Promise<UserSearchResult> => {
    return apiService.get(`/api/v1/usuario/buscar_documento/${documento}`);
  },

  setLeader: async (
    coloniaCodigo: number,
    data: SetLeaderRequest,
  ): Promise<SetLeaderResponse> => {
    return apiService.patch(
      `/api/v1/colonias/establecer_lider/${coloniaCodigo}/`,
      data,
    );
  },
};

import { apiService } from "@/services/api.services";
import type {
  SetLeaderRequest,
  SetLeaderResponse,
} from "../types/leader.types";

export const leaderService = {
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



import { apiService } from "@/services/api.services";
import type { Retorno, RetornoCreateRequest } from "../../types/retorno.types";

class RetornoService {
  private endpoint = "/api/v1/retornos/";

  async create(data: RetornoCreateRequest): Promise<Retorno> {
    return apiService.post<Retorno>(this.endpoint, data);
  }
}

export const retornoService = new RetornoService();

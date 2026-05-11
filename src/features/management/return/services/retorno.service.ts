import { apiService } from "@/services/api.services";
import type { Retorno, RetornoCreateRequest } from "../types/retorno.types";

class RetornoService {
  private readonly endpoint = "/api/v1/retornos/";

  async create(data: RetornoCreateRequest): Promise<Retorno> {
    return apiService.post<Retorno>(this.endpoint, data);
  }

  async getReturns(): Promise<Retorno[]> {
    const response = await apiService.get<Retorno[]>(`${this.endpoint}`);
    return response;
  }
}

export const retornoService = new RetornoService();

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

  /**
       * Obtiene el retorno activo
       * @returns El retorno activo o null si no hay retornos
       */
      async getActiveReturn(): Promise<Retorno | null> {
          const response = await apiService.get<Retorno>(`${this.endpoint}/vigente`);
          if (!response) return null;
          return response;
      }
  
  
      /**
       * Valida si un usuario ya registró el formulario para un retorno específico.
       */
      async hasUserRegistrationInReturn(_userCode: number, _returnCode: number): Promise<boolean> {
  
          const response = await apiService.get<boolean>(
              `${this.endpoint}/esta-registrado-retorno/${_userCode}/${_returnCode}`,
          );
          if (Array.isArray(response)) return response.length > 0;
          return !!response;
      }
}

export const retornoService = new RetornoService();

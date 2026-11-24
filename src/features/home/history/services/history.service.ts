import { apiService } from "@/services/api.services";
import type { PublicationApi, ReturnApi } from "../types/history.types";

/**
 * Acceso a datos de la sección "Historia". Ambos endpoints son públicos.
 *  - `GET /api/v1/retornos/`                            → Retornos (año y estado)
 *  - `GET /api/v1/obtener-publicaciones-retorno/{id}/`  → publicaciones con su multimedia
 */
class HistoryService {
  private readonly returnsEndpoint = "/api/v1/retornos/";
  private readonly publicationsEndpoint = (returnCode: number) =>
    `/api/v1/obtener-publicaciones-retorno/${returnCode}/`;

  async getReturns(): Promise<ReturnApi[]> {
    return apiService.get<ReturnApi[]>(this.returnsEndpoint);
  }

  async getPublications(returnCode: number): Promise<PublicationApi[]> {
    const response = await apiService.get<PublicationApi[]>(
      this.publicationsEndpoint(returnCode),
    );
    return response ?? [];
  }
}

export const historyService = new HistoryService();

import { apiService } from "@/services/api.services";
import type { Retorno } from "@/features/management/return/types/retorno.types";
import type {
  PublicColonyApi,
  PublicPublicationApi,
} from "../types/landing.types";

/**
 * Servicio de datos de la landing pública.
 *
 * Endpoints consumidos (ver backend `app/main.py`, prefijo `/api/v1`):
 *  - `GET /api/v1/colonias/publicas/`                     → colonias activas (público,
 *    sin líder ni estado). No usar `colonias-activas/`: ese exige rol.
 *  - `GET /api/v1/retornos/`                              → listado de retornos (público)
 *  - `GET /api/v1/obtener-publicaciones-retorno/{id}/`    → publicaciones por retorno (público)
 */
class LandingService {
  private readonly coloniesEndpoint = "/api/v1/colonias/publicas/";
  private readonly returnsEndpoint = "/api/v1/retornos/";
  private readonly publicationsByReturnEndpoint = (returnId: number) =>
    `/api/v1/obtener-publicaciones-retorno/${returnId}/`;

  /** Colonias con estado "activa". */
  async getActiveColonies(): Promise<PublicColonyApi[]> {
    return apiService.get<PublicColonyApi[]>(this.coloniesEndpoint);
  }

  /** Todos los retornos registrados (cualquier estado). */
  async getReturns(): Promise<Retorno[]> {
    return apiService.get<Retorno[]>(this.returnsEndpoint);
  }

  /**
   * Total de publicaciones sumando las de cada retorno.
   * El backend no tiene un endpoint de conteo global, por eso se agrega aquí.
   * Si alguna consulta falla, se propaga el error para no mostrar un total parcial.
   */
  async countPublications(returns: Retorno[]): Promise<number> {
    const lists = await Promise.all(
      returns.map((retorno) =>
        apiService.get<PublicPublicationApi[]>(
          this.publicationsByReturnEndpoint(retorno.codigo),
        ),
      ),
    );
    return lists.reduce((total, list) => total + (list?.length ?? 0), 0);
  }
}

export const landingService = new LandingService();

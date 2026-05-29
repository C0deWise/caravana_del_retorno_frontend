import { apiService } from "@/services/api.services";
import { Retorno } from "@/types/retorno.types";
import { PublicationData } from "@/types/publication.types";

export const getPublicReturnsService = async (): Promise<Retorno[]> => {
  return apiService.get<Retorno[]>("/api/v1/retornos/");
};

export const getPublicPublicationsByRetornoService = async (retornoId: number): Promise<PublicationData[]> => {
  return apiService.get<PublicationData[]>(`/api/v1/obtener-publicaciones-retorno/${retornoId}/`);
};

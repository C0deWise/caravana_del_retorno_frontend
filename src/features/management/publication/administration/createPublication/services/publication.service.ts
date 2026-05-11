import { PublicationApiRequest, PublicationData } from "@/types/publication.types";
import { apiService } from "@/services/api.services";

export const getPublicationsService = async (): Promise<PublicationData[]> => {
  return apiService.get<PublicationData[]>("/api/v1/publicacion");
};

export const createPublicationService = async (
  payload: PublicationApiRequest
): Promise<PublicationData> => {
  return apiService.post<PublicationData>("/api/v1/publicacion", payload); //TODO: Ajustar al verdadero endpoint
};

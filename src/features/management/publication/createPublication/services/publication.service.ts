import { PublicationApiRequest, PublicationData } from "@/types/publication.types";
import { apiService } from "@/services/api.services";

export const createPublicationService = async (
  payload: PublicationApiRequest
): Promise<PublicationData> => {
  return apiService.post<PublicationData>("/api/v1/publicacion", payload); //TODO: Cambiar al endpoint real
};

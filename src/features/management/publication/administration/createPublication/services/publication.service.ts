import { PublicationApiRequest, PublicationData } from "@/types/publication.types";
import { apiService } from "@/services/api.services";

export const getPublicationsByRetornoService = async (retornoId: number): Promise<PublicationData[]> => {
  return apiService.get<PublicationData[]>(`/api/v1/obtener-publicaciones-retorno/${retornoId}/`);
};

export const createPublicationService = async (
  payload: PublicationApiRequest,
  onProgress?: (percentage: number) => void
): Promise<PublicationData> => {
  const formData = new FormData();
  formData.append("retorno_id", payload.retorno_id.toString());
  formData.append("autor", payload.autor.toString());
  formData.append("titulo", payload.titulo);
  formData.append("resena", payload.resena);
  
  payload.archivos.forEach((file) => {
    formData.append("archivos", file);
  });

  return apiService.postWithProgress<PublicationData>("/api/v1/crear-publicacion", formData, onProgress);
};

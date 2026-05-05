import { apiService } from "@/services/api.services";

export type UploadResult = {
  id: string;
  name: string;
  success: boolean;
  message?: string;
};

class MultimediaService {
  private readonly endpoint = "/api/v1/multimedia";

  async uploadBulk(
    files: { name: string; dataUrl?: string }[],
  ): Promise<UploadResult[]> {
    return apiService.post<UploadResult[]>(`${this.endpoint}/bulk`, files);
  }
}

export const multimediaService = new MultimediaService();

import { apiService } from "@/services/api.services";

export type UploadResult = {
  id: string;
  name: string;
  success: boolean;
  message?: string;
};

class MultimediaService {
  private readonly endpoint = "/api/v1/multimedia"; //TODO: ajustar endpoint real

  async uploadFile(
    file: { name: string; dataUrl?: string },
    onProgress?: (percentage: number) => void,
  ): Promise<UploadResult> {
    return apiService.postWithProgress<UploadResult>(
      this.endpoint,
      file,
      onProgress,
    );
  }
}

export const multimediaService = new MultimediaService();

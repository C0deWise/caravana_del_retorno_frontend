import { apiService } from "@/services/api.services";
import type {
  RegistrationData,
  RegistrationResponse,
  DocumentValidationResponse,
} from "../types/registro.types";

/**
 * Servicio para manejar las operaciones de registro de usuarios.
 * Incluye funciones para registrar un nuevo usuario y validar documentos.
 */
export const registrationService = {
  userRegistration: async (
    data: RegistrationData,
  ): Promise<RegistrationResponse> => {
    try {
      const response = await apiService.post<RegistrationResponse>(
        "/auth/registro",
        data,
      );
      return response;
    } catch (error) {
      console.error("Error en userRegistration:", error);
      throw error;
    }
  },

  validateDocument: async (
    documentType: string,
    documentNumber: string,
  ): Promise<DocumentValidationResponse> => {
    try {
      const response = await apiService.get<DocumentValidationResponse>(
        `/auth/validate-document?tipo_doc=${documentType}&documento=${documentNumber}`,
      );
      return response as DocumentValidationResponse;
    } catch (error) {
      console.error("Error en validateDocument:", error);
      return {
        valido: false,
        mensaje: "Error al validar el documento",
      };
    }
  },

  getDocumentTypes: async (): Promise<{ id: string; nombre: string[] }> => {
    try {
      const response = await apiService.get<{ id: string; nombre: string[] }>(
        "/auth/document-types",
      );
      return response;
    } catch (error) {
      console.error("Error en getDocumentTypes:", error);
      return { id: "", nombre: [] };
    }
  },
};

import { apiService } from "@/services/api.services";
import { tokenStorage } from "@/auth/utils/tokenStorage";
import { UserData, CODE_TO_ROLE } from "@/types/user.types";

type GoogleStatusResponse = {
  is_linked: boolean;
  google_email: string | null;
  linked_at: string | null;
};

type MessageApiResponse = {
  mensaje?: string;
  message?: string;
};

type SessionApi = {
  id: number;
  documento: string;
  correo: string;
  nombre: string;
  apellido: string;
  codigo_rol: number;
  role_name: string;
  codigo_colonia: number | null;
};

type AuthApiResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  usuario: SessionApi;
};

const resolveMessage = (response: MessageApiResponse, fallback: string): string => {
  if (response.mensaje?.trim()) {
    return response.mensaje;
  }
  if (response.message?.trim()) {
    return response.message;
  }
  return fallback;
};

const mapSessionToUserData = (session: SessionApi): UserData => {
  const role = CODE_TO_ROLE[session.codigo_rol];
  return {
    id: session.id,
    fecha_creacion: new Date().toISOString(),
    tipo_doc: "CC",
    documento: session.documento,
    celular: "",
    correo: session.correo,
    codigo_colonia: session.codigo_colonia,
    codigo_retorno: null,
    nombre: session.nombre,
    apellido: session.apellido,
    genero: "otro",
    fecha_nacimiento: "2000-01-01",
    pais: "",
    departamento: null,
    ciudad: null,
    role,
  };
};

export const googleLinkService = {
  async getStatus(): Promise<GoogleStatusResponse> {
    return apiService.get<GoogleStatusResponse>("/api/v1/usuario/google/status");
  },

  async link(googleToken: string): Promise<string> {
    const response = await apiService.post<MessageApiResponse>(
      "/api/v1/usuario/google/link",
      { google_token: googleToken },
    );
    return resolveMessage(response, "Cuenta de Google vinculada exitosamente.");
  },

  async unlink(password: string): Promise<string> {
    const response = await apiService.post<MessageApiResponse>(
      "/api/v1/usuario/google/unlink",
      { password },
    );
    return resolveMessage(response, "Cuenta de Google desvinculada exitosamente.");
  },

  async login(googleToken: string): Promise<UserData> {
    const response = await apiService.post<AuthApiResponse>(
      "/api/v1/usuario/google/login",
      { google_token: googleToken },
    );
    tokenStorage.setTokens(response.access_token, response.refresh_token);
    return mapSessionToUserData(response.usuario);
  },
};

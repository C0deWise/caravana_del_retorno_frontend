
/**
 * Su función principal es gestionar el ciclo de vida de la sesión del usuario
 *  mediante la comunicación con la API (login, refresco de token y recuperación
 *  de perfil). Es el punto de integración donde los datos crudos recibidos desde
 *  el backend se normalizan a la estructura UserData definida en el sistema, 
 * asegurando que el estado de la aplicación siempre maneje tipos consistentes.
 */


import { apiService } from "@/services/api.services";
import { UserData, CODE_TO_ROLE } from "@/types/user.types";
import { tokenStorage } from "@/auth/utils/tokenStorage";

/**
 * Estructura de la sesión recibida directamente desde el servidor.
 * Refleja la respuesta del backend para la autenticación y obtención de perfil.
 */
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

/**
 * Estructura de la respuesta completa del endpoint de login.
 * Incluye el JWT y la información básica de sesión del usuario.
 */
type AuthApiResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  usuario: SessionApi;
};

type MessageApiResponse = {
  mensaje?: string;
  message?: string;
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

/**
 * Función transformadora (Mapeador)
 * Convierte el modelo de respuesta del API (`SessionApi`) al modelo de dominio `UserData`.
 * Utiliza 'CODE_TO_ROLE' para normalizar el rol numérico a un valor tipado.
 */
const mapSessionToUserData = (session: SessionApi): UserData => {
  const role = CODE_TO_ROLE[session.codigo_rol];

  return {
    id: session.id,
    fecha_creacion: new Date().toISOString(),
    tipo_doc: "CC", // Valor por defecto, debería validarse si el backend lo retorna
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

/**
 * Servicio de Autenticación
 * Encapsula las operaciones de autenticación con el backend.
 */
export const authApi = {
  /**
   * Realiza el proceso de login, guarda el token en el almacenamiento persistente
   * y retorna la información del usuario normalizada.
   */
  async login(correo: string, contrasenia: string): Promise<UserData> {
    const response = await apiService.post<AuthApiResponse>("/api/v1/usuario/login", {
      correo,
      contrasenia,
    });

    tokenStorage.setTokens(response.access_token, response.refresh_token);
    return mapSessionToUserData(response.usuario);
  },

  /**
   * Renueva la sesión usando el refresh token de la cookie HttpOnly.
   */
  async refresh(): Promise<UserData> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiService.post<AuthApiResponse>("/api/v1/usuario/refresh", {
      refresh_token: refreshToken
    });
    tokenStorage.setTokens(response.access_token, response.refresh_token);
    return mapSessionToUserData(response.usuario);
  },

  /**
   * Obtiene la información del usuario actual basada en el token en memoria.
   */
  async me(): Promise<UserData> {
    const response = await apiService.get<SessionApi>("/api/v1/usuario/me");
    return mapSessionToUserData(response);
  },

  async requestPasswordReset(correo: string): Promise<string> {
    const response = await apiService.post<MessageApiResponse>("/api/v1/usuario/forgot-password", {
      correo: correo.trim().toLowerCase(),
    });

    return resolveMessage(
      response,
      "Si el correo existe en el sistema, recibirás un enlace para restablecer tu contraseña.",
    );
  },

  async resetPassword(
    token: string,
    nuevaContrasenia: string,
    confirmarContrasenia: string,
  ): Promise<string> {
    const response = await apiService.post<MessageApiResponse>("/api/v1/usuario/reset-password", {
      token: token.trim(),
      nueva_contrasenia: nuevaContrasenia,
      confirmar_contrasenia: confirmarContrasenia,
    });

    return resolveMessage(response, "Contraseña actualizada exitosamente.");
  },

  /**
   * Cierra la sesión eliminando los tokens del almacenamiento local.
   */
  logout(): void {
    tokenStorage.clear();
  },
};
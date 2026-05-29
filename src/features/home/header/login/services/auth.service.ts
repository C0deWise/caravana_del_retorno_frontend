import { ApiError } from "@/services/api.services";
import { UserData } from "@/types/user.types";
import { authApi } from "@/services/auth.api";

/**
 * Servicio de Autenticación de alto nivel.
 * Implementa validaciones de entrada y normalización antes de llamar a la API.
 */
export const authService = {
  /**
   * Procesa el intento de inicio de sesión.
   * Aplica saneamiento básico (trim/lowercase) y validación de campos requeridos.
   * 
   * @param correo - Correo electrónico del usuario.
   * @param contrasenia - uwu Contraseña del usuario.
   * @returns Promesa que resuelve en los datos del usuario logueado (UserData).
   * @throws {ApiError} - Lanzado si faltan campos o si la autenticación falla.
   */
  login: async (correo: string, contrasenia: string): Promise<UserData> => {
    // Normalización: Asegura que el correo no tenga espacios y sea consistente en minúsculas
    const normalizedCorreo = correo.trim().toLowerCase();
    // Normalización: Limpieza de espacios accidentales en la contraseña
    const normalizedPassword = contrasenia.trim();

    // Validación de entrada: Evita peticiones innecesarias al servidor si los campos están vacíos
    if (!normalizedCorreo) {
      throw new ApiError(400, "Debes ingresar un correo");
    }

    if (!normalizedPassword) {
      throw new ApiError(400, "Debes ingresar una contraseña");
    }

    // Delegación: Llama al servicio de API real solo si los datos están validados
    return authApi.login(normalizedCorreo, normalizedPassword);
  },
};
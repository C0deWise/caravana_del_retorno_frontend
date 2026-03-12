import { apiService } from "./api.services";
import type { UserData, UserResponse } from "../types/user.types";

/**
 * Servicio para manejar las operaciones de gestión de usuarios.
 */
export const userService = {

    /**
     * @brief Crea un nuevo usuario.
     * @param data Datos del usuario a crear
     * @return Retorna un response con la información del usuario creado o un error si la operación falla.
     */
    createUser : async (data: UserData): Promise<UserResponse> => {
        try {
            const response = await apiService.post<UserResponse>('/users', data);
            return response;
        } catch (error) {
            console.error('Error en createUser:', error);
            throw error;
        }
    },

    /**
     * 
     * @param us_codigo Código del usuario a obtener
     * @returns Retorna un response con la información del usuario solicitado o un error si la operación falla.
     */
    getUser : async (us_codigo: string): Promise<UserResponse> => {
        try {
            const response = await apiService.get<UserResponse>(`/users/${us_codigo}`);
            return response;
        } catch (error) {
            console.error('Error en getUser:', error);
            throw error;
        }
    },

    /**
     * 
     * @param us_codigo Código del usuario a obtener información
     * @param data Información de usuario a actualizar
     * @returns Retorna un response con la información del usuario o un error si la operación falla.
     */
    updateUser : async (us_codigo: string, data: UserData): Promise<UserResponse> => {
        try {
            const response = await apiService.put<UserResponse>(`/users/${us_codigo}`, data);
            return response;
        } catch (error) {
            console.error('Error en updateUser:', error);
            throw error;
        }
    },

    deleteUser : async (us_codigo: string): Promise<UserResponse> => {
        try {
            const response = await apiService.delete<UserResponse>(`/users/${us_codigo}`);
            return response;
        } catch (error) {
            console.error('Error en deleteUser:', error);
            throw error;
        }
    }
}
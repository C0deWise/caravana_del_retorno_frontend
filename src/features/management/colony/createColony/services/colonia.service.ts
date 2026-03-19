import { apiService } from '@/shared/services/api.services';
import type {
    ColoniaData,
    ColoniaResponse
} from '../types/colonia.types';

/**
 * Servicio para manejar las operaciones de gestión de colonias.
 * Incluye funciones para crear y gestionar colonias.
 */
export const coloniaService = {

    createColonia: async (data: ColoniaData): Promise<ColoniaResponse> => {
        try {
            const response = await apiService.post<ColoniaResponse>('/colonias', data);
            return response;
        } catch (error) {
            console.error('Error en createColonia:', error);
            throw error;
        }
    },

    getColonias: async (): Promise<ColoniaResponse> => {
        try {
            const response = await apiService.get<ColoniaResponse>('/colonias');
            return response;
        } catch (error) {
            console.error('Error en getColonias:', error);
            throw error;
        }
    }
}

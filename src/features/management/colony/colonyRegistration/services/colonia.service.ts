import { apiService } from '@/shared/services/api.services';
import type {
    ColonyData,
    ColonyData,
    ColonyResponse
} from '@/types/colony.types';

/**
 * Servicio para manejar las operaciones de gestión de colonias.
 * Incluye funciones para crear y gestionar colonias.
 */
export const coloniaService = {

    createColonia: async (data: ColonyData): Promise<ColonyResponse<ColonyData>> => {
        try {
            const response = await apiService.post<ColonyResponse<ColonyData>>('/colonias', data);
            return response;
        } catch (error) {
            console.error('Error en createColonia:', error);
            throw error;
        }
    },

    getColonias: async (): Promise<ColonyResponse<ColonyData[]>> => {
        try {
            const response = await apiService.get<ColonyResponse<ColonyData[]>>('/colonias');
            return response;
        } catch (error) {
            console.error('Error en getColonias:', error);
            throw error;
        }
    }
}

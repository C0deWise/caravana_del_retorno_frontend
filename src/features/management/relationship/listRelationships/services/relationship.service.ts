import { apiService } from "@/shared/services/api.services";
import type { RelationshipData, RelationshipItem, RelationshipResponse } from "../types/relationship.type";

/**
 * Servicio para manejar las operaciones relacionadas con las relaciones entre usuarios.
 * Incluye funciones para obtener, crear, actualizar y eliminar relaciones.
 */

export const relationshipService = {
    
    createRelationship: async (data: RelationshipData): Promise<RelationshipResponse<RelationshipItem>> => {
        try {
            const response = await apiService.post<RelationshipResponse<RelationshipItem>>('/relationships', data);
            return response;
        } catch (error) {
            console.error('Error en createRelationship:', error);
            throw error;
        }
    },

    getRelationships: async (): Promise<RelationshipResponse<RelationshipItem[]>> => {
        try {
            const response = await apiService.get<RelationshipResponse<RelationshipItem[]>>('/relationships');
            return response;
        } catch (error) {
            console.error('Error en getRelationships:', error);
            throw error;
        }
    },

    updateRelationship: async (codigo: string, data: Partial<RelationshipData>): Promise<RelationshipResponse<RelationshipItem>> => {
        try {
            const response = await apiService.put<RelationshipResponse<RelationshipItem>>(`/relationships/${codigo}`, data);
            return response;
        } catch (error) {
            console.error('Error en updateRelationship:', error);
            throw error;
        }
    },

    deleteRelationship: async (codigo: string): Promise<RelationshipResponse> => {
        try {
            const response = await apiService.delete<RelationshipResponse>(`/relationships/${codigo}`);
            return response;
        } catch (error) {
            console.error('Error en deleteRelationship:', error);
            throw error;
        }
    }
}
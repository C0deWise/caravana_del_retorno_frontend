import { apiService } from "@/services/api.services";
import {
  RelationshipApiItem,
  RelationshipItem,
  formatKinshipType,
} from "../types/relationship.type";

export const listRelationshipsService = async (
  codigoUsuario: number,
): Promise<RelationshipApiItem[]> => {
  const response = await apiService.get<RelationshipApiItem[] | { data: RelationshipApiItem[] }>(
    `/api/v1/usuario/${codigoUsuario}/parentescos`,
  );

  if (response && "data" in response && Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response)) {
    return response;
  }
  return [];
};

export const acceptRelationshipService = async (
  solicitudId: string | number,
): Promise<void> => {
  await apiService.patch(
    `/api/v1/usuario/solicitud-parentesco/aceptar/${solicitudId}`,
  );
};

export const rejectRelationshipService = async (
  solicitudId: string | number,
): Promise<void> => {
  await apiService.patch(
    `/api/v1/usuario/solicitud-parentesco/rechazar/${solicitudId}`,
  );
};

export const listRelationshipsWithUsersService = async (
  codigoUsuario: number,
): Promise<RelationshipItem[]> => {
  const relationships = await listRelationshipsService(codigoUsuario);

  return relationships.map((relationship): RelationshipItem => {
    return {
      codigo: String(relationship.codigo),
      user: {
        id: relationship.solicitante?.us_codigo ?? 0,
        nombre: relationship.solicitante?.us_nombre ?? "Usuario desconocido",
        apellido: relationship.solicitante?.us_apellido ?? "",
      },
      relatedUser: {
        id: relationship.destinatario?.us_codigo ?? 0,
        nombre: relationship.destinatario?.us_nombre ?? "Usuario desconocido",
        apellido: relationship.destinatario?.us_apellido ?? "",
      },
      relationshipType: formatKinshipType(relationship.tipo_parentesco),
      status: relationship.estado,
    };
  });
};


import { apiService } from "@/services/api.services";
import { userService } from "@/services/user.service";
import {
  RelationshipApiItem,
  RelationshipItem,
  formatKinshipType,
} from "../types/relationship.type";

export const listRelationshipsService = async (
  codigoUsuario: number,
): Promise<RelationshipApiItem[]> => {
  return apiService.get<RelationshipApiItem[]>(
    `/api/v1/usuario/${codigoUsuario}/parentescos`,
  );
};

export const listRelationshipsWithUsersService = async (
  codigoUsuario: number,
): Promise<RelationshipItem[]> => {
  const relationships = await listRelationshipsService(codigoUsuario);

  const uniqueUserIds = new Set<number>();
  relationships.forEach((r) => {
    uniqueUserIds.add(r.codigo_solicitante);
    uniqueUserIds.add(r.codigo_destinatario);
  });

  const userPromises = Array.from(uniqueUserIds).map((id) =>
    userService.getUserById(id).catch(() => null),
  );
  const fetchedUsers = await Promise.all(userPromises);

  const userMap = new Map<number, NonNullable<(typeof fetchedUsers)[0]>>();
  fetchedUsers.forEach((user) => {
    if (user) userMap.set(user.id, user);
  });

  return relationships.map((relationship): RelationshipItem => {
    const solicitante = userMap.get(relationship.codigo_solicitante);
    const destinatario = userMap.get(relationship.codigo_destinatario);

    return {
      codigo: String(relationship.codigo),
      user: {
        id: solicitante?.id ?? relationship.codigo_solicitante,
        nombre: solicitante?.nombre ?? "Usuario desconocido",
        apellido: solicitante?.apellido ?? "",
      },
      relatedUser: {
        id: destinatario?.id ?? relationship.codigo_destinatario,
        nombre: destinatario?.nombre ?? "Usuario desconocido",
        apellido: destinatario?.apellido ?? "",
      },
      relationshipType: formatKinshipType(relationship.tipo_parentesco),
      status: relationship.estado,
    };
  });
};


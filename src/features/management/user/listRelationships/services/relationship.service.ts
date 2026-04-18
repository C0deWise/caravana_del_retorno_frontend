import { apiService } from "@/services/api.services";
import {
  RelationshipApiItem,
  RelationshipItem,
  UserByIdResponse,
  RequestRelationshipDto,
} from "../types/relationship.type";

export const listRelationshipsService = async (
  codigoUsuario: number,
): Promise<RelationshipApiItem[]> => {
  return apiService.get<RelationshipApiItem[]>(
    `/api/v1/usuario/${codigoUsuario}/parentescos`,
  );
};

export const listUsersService = async (): Promise<UserByIdResponse[]> => {
  return apiService.get<UserByIdResponse[]>("/api/v1/usuario/");
};

const findUserById = (
  users: UserByIdResponse[],
  id: number,
): UserByIdResponse | null => {
  return users.find((user) => user.id === id) ?? null;
};

export const listRelationshipsWithUsersService = async (
  codigoUsuario: number,
): Promise<RelationshipItem[]> => {
  const [relationships, users] = await Promise.all([
    listRelationshipsService(codigoUsuario),
    listUsersService(),
  ]);

  return relationships.map((relationship): RelationshipItem => {
    const solicitante = findUserById(users, relationship.codigo_solicitante);
    const destinatario = findUserById(users, relationship.codigo_destinatario);

    return {
      codigo: String(relationship.codigo),
      user: {
        id: solicitante?.id ?? 0,
        nombre: solicitante?.nombre ?? "Usuario desconocido",
        apellido: solicitante?.apellido ?? "",
      },
      relatedUser: {
        id: destinatario?.id ?? 0,
        nombre: destinatario?.nombre ?? "Usuario desconocido",
        apellido: destinatario?.apellido ?? "",
      },
      relationshipType: relationship.tipo_parentesco,
      status: relationship.estado,
    };
  });
};

export const requestRelationshipService = async (
  payload: RequestRelationshipDto,
): Promise<void> => {
  await apiService.post("/api/v1/usuario/solicitar-parentesco", payload);
};

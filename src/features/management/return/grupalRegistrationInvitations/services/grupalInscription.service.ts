import { apiService } from "@/services/api.services";
import type {
  GrupalInvitation,
  GrupalInvitationDto,
  ListGrupalInvitationsResponseDto,
} from "../types/grupalInscription.types";
import {
  mapGrupalInvitationDtoToModel,
  mapGrupalInvitationListDtoToModel,
} from "../types/grupalInscription.types";

export async function listMyGrupalInvitations(userId: string): Promise<GrupalInvitation[]> {

  const data = await apiService.get<ListGrupalInvitationsResponseDto>(
    `/api/v1/grupoRetorno/solicitudes/recientes/usuario/${userId}`,
  );

  return mapGrupalInvitationListDtoToModel(data);
}

export async function acceptGrupalInvitation(
  invitationId: number,
): Promise<GrupalInvitation> {

  const data = await apiService.patch<GrupalInvitationDto>(
    `/api/v1/grupoRetorno/solicitudes/aceptar/${invitationId}`,
  );

  return mapGrupalInvitationDtoToModel(data);
}

export async function rejectGrupalInvitation(
  invitationId: number,
): Promise<GrupalInvitation> {

  const data = await apiService.patch<GrupalInvitationDto>(
    `/api/v1/grupoRetorno/solicitudes/rechazar/${invitationId}`,
  );

  return mapGrupalInvitationDtoToModel(data);
}

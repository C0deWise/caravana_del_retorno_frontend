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

export async function listMyGrupalInvitations(): Promise<GrupalInvitation[]> {

  const data = await apiService.get<ListGrupalInvitationsResponseDto>(
    "/api/v1/grupos/mis-invitaciones",
  );

  return mapGrupalInvitationListDtoToModel(data);
}

export async function acceptGrupalInvitation(
  invitationId: number,
): Promise<GrupalInvitation> {

  const data = await apiService.patch<GrupalInvitationDto>(
    `/api/v1/grupos/solicitud-grupo/${invitationId}/aceptar`,
  );

  return mapGrupalInvitationDtoToModel(data);
}

export async function rejectGrupalInvitation(
  invitationId: number,
): Promise<GrupalInvitation> {

  const data = await apiService.patch<GrupalInvitationDto>(
    `/api/v1/grupos/solicitud-grupo/${invitationId}/rechazar`,
  );

  return mapGrupalInvitationDtoToModel(data);
}

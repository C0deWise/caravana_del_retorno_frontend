import { apiService } from "@/services/api.services";
import type {
  AccessRequest,
  AccessRequestDto,
  ListAccessRequestsResponseDto,
} from "../types/access-request.types";
import {
  mapAccessRequestDtoToModel,
  mapAccessRequestListDtoToModel,
} from "../types/access-request.mapper";

export async function listAccessRequestsByColony(
  colonyId: number,
): Promise<AccessRequest[]> {
  const data = await apiService.get<ListAccessRequestsResponseDto>(
    `/api/v1/colonias/solicitudes-pendientes/${colonyId}`,
  );

  return mapAccessRequestListDtoToModel(data);
}

export async function acceptAccessRequest(
  requestId: number,
): Promise<AccessRequest> {
  const data = await apiService.patch<AccessRequestDto>(
    `/api/v1/colonias/solicitud-colonia/${requestId}/aceptar`,
  );

  return mapAccessRequestDtoToModel(data);
}

export async function rejectAccessRequest(
  requestId: number,
): Promise<AccessRequest> {
  const data = await apiService.patch<AccessRequestDto>(
    `/api/v1/colonias/solicitud-colonia/${requestId}/rechazar`,
  );

  return mapAccessRequestDtoToModel(data);
}

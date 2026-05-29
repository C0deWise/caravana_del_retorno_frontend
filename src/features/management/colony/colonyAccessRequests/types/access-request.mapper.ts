import {
  AccessRequest,
  AccessRequestDto,
  AccessRequestStatus,
  STATUS_MAP,
} from "./access-request.types";
import { normalizeString } from "@/utils/formatting";

const normalizeStatus = (rawStatus: string): AccessRequestStatus => {
  const normalized = normalizeString(rawStatus);
  const status = STATUS_MAP[normalized as AccessRequestStatus];
  return status ?? "pendiente";
};

export const mapAccessRequestDtoToModel = (
  dto: AccessRequestDto,
): AccessRequest => {
  const status = normalizeStatus(dto.estado);
  const fullName = `${dto.nombre_usuario} ${dto.apellido_usuario}`.trim();

  return {
    id: dto.codigo,
    status,
    createdAt: dto.fecha_creacion,
    userId: dto.codigo_usuario,
    userFirstName: dto.nombre_usuario,
    userLastName: dto.apellido_usuario,
    colonyId: dto.codigo_colonia,
    fullName,
    isPending: status === "pendiente",
    isExpired: status === "expirada",
    isActionable: status === "pendiente",
  };
};

export const mapAccessRequestListDtoToModel = (
  dtos: AccessRequestDto[],
): AccessRequest[] => dtos.map(mapAccessRequestDtoToModel);


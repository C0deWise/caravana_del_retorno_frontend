import {
  AccessRequest,
  AccessRequestDto,
  AccessRequestStatus,
} from "./access-request.types";

const STATUS_MAP: Record<string, AccessRequestStatus> = {
  pendiente: "pendiente",
  aceptada: "aceptada",
  rechazada: "rechazada",
  expirada: "expirada",
};

const normalizeStatus = (rawStatus: string): AccessRequestStatus => {
  const normalized = rawStatus.toLowerCase().trim();
  return STATUS_MAP[normalized] ?? "pendiente";
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

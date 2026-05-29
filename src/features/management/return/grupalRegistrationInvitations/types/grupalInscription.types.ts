// ── Status ────────────────────────────────────────────────────────────────────
export type GrupalInvitationStatus =
  | "pendiente"
  | "aceptado"
  | "rechazado"
  | "expirado";

// ── DTOs (forma que devuelve la API) ──────────────────────────────────────────
export interface GrupalInvitationDto {
  id: number;
  usuario_id: number;
  nombre_lider: string;
  grupo_id: number;
  estado: string;
  timestamp: string;
}

export type ListGrupalInvitationsResponseDto = GrupalInvitationDto[];

// ── Domain models ─────────────────────────────────────────────────────────────
export interface GrupalInvitation {
  id: number;
  userId: number;
  groupId: number;
  status: GrupalInvitationStatus;
  createdAt: string;
  leaderFullName: string;
  isPending: boolean;
  isExpired: boolean;
  isActionable: boolean;
}

// ── Mapper ────────────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, GrupalInvitationStatus> = {
  pendiente: "pendiente",
  aceptado: "aceptado",
  rechazado: "rechazado",
  expirado: "expirado",
};

const normalizeStatus = (raw: string): GrupalInvitationStatus =>
  STATUS_MAP[raw.toLowerCase().trim()] ?? "pendiente";

export const mapGrupalInvitationDtoToModel = (
  dto: GrupalInvitationDto,
): GrupalInvitation => {
  const status = normalizeStatus(dto.estado);

  return {
    id: dto.id,
    userId: dto.usuario_id,
    groupId: dto.grupo_id,
    status,
    createdAt: dto.timestamp,
    leaderFullName: dto.nombre_lider,
    isPending: status === "pendiente",
    isExpired: status === "expirado",
    isActionable: status === "pendiente",
  };
};

export const mapGrupalInvitationListDtoToModel = (
  dtos: GrupalInvitationDto[],
): GrupalInvitation[] => dtos.map(mapGrupalInvitationDtoToModel);

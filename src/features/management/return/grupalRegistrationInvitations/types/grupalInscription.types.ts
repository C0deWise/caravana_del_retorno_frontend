// ── Status ────────────────────────────────────────────────────────────────────
export type GrupalInvitationStatus =
  | "pendiente"
  | "aprobada"
  | "rechazada"
  | "expirada";

// ── DTOs (forma que devuelve la API) ──────────────────────────────────────────
export interface ParticipantDto {
  usuario: number;
  nombre: string;
  apellido: string;
}

export interface GrupalInvitationDto {
  codigo: number;
  grupo: number;
  estado: string;
  fecha_solicitud: string;
  nombre_lider: string;
  apellido_lider: string;
  fecha_retorno: string;
  participantes_confirmados: ParticipantDto[];
}

export type ListGrupalInvitationsResponseDto = GrupalInvitationDto[];

// ── Domain models ─────────────────────────────────────────────────────────────
export interface Participant {
  userId: number;
  fullName: string;
}

export interface GrupalInvitation {
  id: number;
  groupId: number;
  status: GrupalInvitationStatus;
  createdAt: string;
  leaderFullName: string;
  returnDate: string;
  confirmedParticipants: Participant[];
  isPending: boolean;
  isExpired: boolean;
  isActionable: boolean;
}

// ── Mapper ────────────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, GrupalInvitationStatus> = {
  pendiente: "pendiente",
  aprobada: "aprobada",
  rechazada: "rechazada",
  expirada: "expirada",
};

const normalizeStatus = (raw: string): GrupalInvitationStatus =>
  STATUS_MAP[raw.toLowerCase().trim()] ?? "pendiente";

export const mapGrupalInvitationDtoToModel = (
  dto: GrupalInvitationDto,
): GrupalInvitation => {
  const status = normalizeStatus(dto.estado);

  return {
    id: dto.codigo,
    groupId: dto.grupo,
    status,
    createdAt: dto.fecha_solicitud,
    leaderFullName: `${dto.nombre_lider} ${dto.apellido_lider}`.trim(),
    returnDate: dto.fecha_retorno,
    confirmedParticipants: dto.participantes_confirmados.map((p) => ({
      userId: p.usuario,
      fullName: `${p.nombre} ${p.apellido}`.trim(),
    })),
    isPending: status === "pendiente",
    isExpired: status === "expirada",
    isActionable: status === "pendiente",
  };
};

export const mapGrupalInvitationListDtoToModel = (
  dtos: GrupalInvitationDto[],
): GrupalInvitation[] => dtos.map(mapGrupalInvitationDtoToModel);

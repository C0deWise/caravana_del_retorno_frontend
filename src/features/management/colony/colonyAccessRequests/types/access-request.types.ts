const STATUS_VALUES = ["pendiente", "expirada"] as const;

export type AccessRequestStatus = typeof STATUS_VALUES[number];

export const STATUS_MAP = Object.fromEntries(
  STATUS_VALUES.map((s) => [s, s]),
) as Record<AccessRequestStatus, AccessRequestStatus>;

export interface AccessRequestDto {
  codigo: number;
  estado: string;
  fecha_creacion: string;
  codigo_usuario: number;
  nombre_usuario: string;
  apellido_usuario: string;
  codigo_colonia: number;
}

export interface AccessRequest {
  id: number;
  status: AccessRequestStatus;
  createdAt: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
  colonyId: number;
  fullName: string;
  isPending: boolean;
  isExpired: boolean;
  isActionable: boolean;
}

export type ListAccessRequestsResponseDto = AccessRequestDto[];

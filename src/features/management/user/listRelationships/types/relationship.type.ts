import { UserData } from "@/types/user.types";

export type KinshipType =
  | "padre"
  | "madre"
  | "hermano (a)"
  | "hijo (a)"
  | "abuelo (a)"
  | "tio (a)"
  | "primo (a)"
  | "madrastra"
  | "padrastro"
  | "hijastro (a)"
  | "conyuge";

export const KINSHIP_TYPE_OPTIONS: { label: string; value: KinshipType }[] = [
  { label: "Padre", value: "padre" },
  { label: "Madre", value: "madre" },
  { label: "Hermano(a)", value: "hermano (a)" },
  { label: "Hijo(a)", value: "hijo (a)" },
  { label: "Abuelo(a)", value: "abuelo (a)" },
  { label: "Tío(a)", value: "tio (a)" },
  { label: "Primo(a)", value: "primo (a)" },
  { label: "Madrastra", value: "madrastra" },
  { label: "Padrastro", value: "padrastro" },
  { label: "Hijastro(a)", value: "hijastro (a)" },
  { label: "Cónyuge", value: "conyuge" },
];

export interface RequestRelationshipDto {
  codigo_solicitante: number;
  codigo_destinatario: number;
  tipo_parentesco: KinshipType;
}

export type RelationshipStatus =
  | "pendiente"
  | "aceptada"
  | "rechazada"
  | "expirada";

export type User = Pick<UserData, "id" | "nombre" | "apellido">;

export interface RelationshipApiItem {
  codigo: number;
  codigo_solicitante: number;
  codigo_destinatario: number;
  tipo_parentesco: string;
  estado: RelationshipStatus;
}

export interface RelationshipData {
  codigo?: string;
  userId: string;
  relatedUserId: string;
  relationshipType: string;
  status: string;
}

export interface RelationshipItem {
  codigo?: string;
  user: User;
  relatedUser: User;
  relationshipType: string;
  status: RelationshipStatus;
}

export interface RelationshipResponse<TData = unknown> {
  success: boolean;
  message: string;
  data?: TData;
}

export interface UserByIdResponse {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  documento: string;
}

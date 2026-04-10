import { UserData } from "@/types/user.types";

export type RelationshipStatus = "aceptada" | "pendiente" | "rechazada";

export type User = Pick<UserData, "id" | "nombre" | "apellido">;

export interface RelationshipApiItem {
  pa_codigo: number;
  us_codigo_solicitante: number;
  us_codigo_destinatario: number;
  pa_tipo_parentesco: string;
  pa_estado: RelationshipStatus;
  pa_fecha_creacion: string;
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

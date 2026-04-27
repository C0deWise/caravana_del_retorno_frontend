export interface UserSearchResult {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  documento: string;
}

export interface SetLeaderRequest {
  lider_id: number;
}

export interface SetLeaderResponse {
  co_codigo: number;
  co_pais: string;
  co_departamento: string;
  co_ciudad: string;
  lider: number;
}

export type SearchMode = "nombre" | "documento";

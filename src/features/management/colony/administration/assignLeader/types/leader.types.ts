export interface AssignLeaderRequest {
  coloniaCodigo: number;
  liderId: number;
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

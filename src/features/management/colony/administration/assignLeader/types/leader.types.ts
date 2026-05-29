export interface AssignLeaderRequest {
  coloniaCodigo: number;
  liderId: number;
  isChange?: boolean;
}

export interface SetLeaderRequest {
  lider: number;
}

export interface SetLeaderResponse {
  codigo: number;
  pais: string;
  departamento: string | null;
  ciudad: string | null;
  lider: number;
}

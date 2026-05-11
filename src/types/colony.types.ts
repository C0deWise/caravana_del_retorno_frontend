export interface ColonyApi {
  codigo: number;
  pais: string;
  departamento: string | null;
  ciudad: string | null;
  lider: number | null;
  estado?: string;
}

export type ColonyData = Omit<ColonyApi, "lider"> & {
  lider: number;
};

export interface ColonyApiRequest {
  pais: string;
  departamento: string | null;
  ciudad: string | null;
  lider: number | null;
}

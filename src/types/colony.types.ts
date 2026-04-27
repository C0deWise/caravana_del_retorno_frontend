export interface ColonyApi {
  co_codigo: number;
  co_pais: string;
  co_departamento: string | null;
  co_ciudad: string | null;
  lider: number;
}

export interface ColonyApiRequest {
  pais: string;
  departamento: string | null;
  ciudad: string | null;
  lider: number | null;
}

export type ColonyData = Pick<ColonyApi, "lider"> & {
  codigo: number;
  pais: string;
  departamento: string | null;
  ciudad: string | null;
};

export type ColonyItem = ColonyData;

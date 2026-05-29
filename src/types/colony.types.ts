import { UserApi } from "./user.types";

export interface ColonyApi {
  codigo: number;
  pais: string;
  departamento: string | null;
  ciudad: string | null;
  lider: number | null;
  estado?: string;
}

export type ColonyData = Omit<ColonyApi, "lider"> & {
  lider: number | null;
};

export interface ColonyApiRequest {
  pais: string;
  departamento: string | null;
  ciudad: string | null;
  lider: number | null;
}

export interface ColonyMember extends Omit<UserApi, "codigo_rol"> {
  role: number;
}


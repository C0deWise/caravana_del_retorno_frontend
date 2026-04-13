export interface RetornoCreateRequest {
  anio: number;
  estado: string;
}

export interface Retorno {
  codigo: number;
  fecha_creacion: string;
  anio: number;
  estado: string;
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  codigo?: number;
}

export interface PublicationApi {
  codigo: number;
  codigo_retorno: number;
  codigo_colonia: number;
  codigo_autor: number;
  resena: string;
  titulo: string;
  fecha_creacion: string;
}

export interface PublicationApiRequest {
  codigo_retorno: number;
  codigo_colonia: number;
  codigo_autor: number;
  resena: string;
  titulo: string;
}

export type PublicationData = PublicationApi;

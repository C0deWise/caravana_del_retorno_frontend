export interface PublicationMultimedia {
  codigo: number;
  publicacion: number;
  tipo: string;
  formato: string;
  url: string;
  descripcion: string;
}

export interface PublicationApi {
  codigo: number;
  retorno: number;
  autor: number;
  titulo: string;
  resena: string;
  fecha_creacion: string;
  multimedia_lista: PublicationMultimedia[];
}

export interface PublicationApiRequest {
  retorno_id: number;
  autor: number;
  titulo: string;
  resena: string;
  archivos: File[];
}

export type PublicationData = PublicationApi;

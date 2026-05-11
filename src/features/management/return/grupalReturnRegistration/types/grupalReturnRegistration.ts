import { UserApi } from "@/types/user.types";

export interface GruposRetornoCreateRequest {
    liderId: number,
}

export interface GruposRetorno {
    id: number,
    liderId: number,
}

export type SolicitudEstado = "Pendiente" | "Aceptada" | "Rechazada";

export interface SolicitudMiembroRequest {
    usuarioId: number;
    grupoId: number;
}

export interface SolicitudMiembro {
    id: number;
    usuarioId: number;
    grupoId: number;
    estado: SolicitudEstado;
    nombreUsuario?: string;
    apellidoUsuario?: string;
}

export interface RegistroGrupoRetornoRequest {
    retorno: number;
    grupoId: number;
    num_hospedaje: number;
    num_transporte: number;
    num_parqueadero: number;
    anotacion?: string;
}

export interface RegistroGrupoRetorno {
    id: number;
    retorno: number;
    grupoId: number;
    num_hospedaje: number;
    num_transporte: number;
    num_parqueadero: number;
    anotacion: string | null;
}

export type MiembroGrupo = Pick<
    UserApi,
    "id" | "nombre" | "apellido" | "documento" | "tipo_doc" | "correo" | "celular"
>;
import { UserApi } from "@/types/user.types";
import { Persona } from "../externalPerson/types/persona.types";

export interface GruposRetornoCreateRequest {
    lider: number,
}

export interface GruposRetorno {
    gr_codigo: number,
    us_codigo_lider: number,
}

export type EntradaInvitacion = 
    | { kind: "usuario"; data: SolicitudMiembro }
    | { kind: "persona"; data: Persona };

export type SolicitudEstado = "Pendiente" | "Aceptada" | "Rechazada";

export interface SolicitudMiembroRequest {
    us_codigo: number;
    gr_codigo: number;
}

export interface SolicitudMiembro {
    id: number;
    usuario_id: number;
    correo_usuario: string;
    grupo_id: number;
    estado: string;
    timestamp: string;
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
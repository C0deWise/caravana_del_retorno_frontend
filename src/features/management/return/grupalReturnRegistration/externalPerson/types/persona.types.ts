export type TipoDoc = "CC" | "CE" | "TI";
export type Genero = "M" | "F";

export interface PersonaCreateRequest {
    pe_tipo_doc: TipoDoc;
    pe_documento: string;
    pe_nombre: string;
    pe_apellido: string;
    pe_correo?: string;
    pe_fecha_nacimiento: string;
    pe_genero: Genero;
}

export interface Persona {
    pe_codigo: number;
    pe_tipo_doc: TipoDoc;
    pe_documento: string;
    pe_nombre: string;
    pe_apellido: string;
    pe_correo?: string;
    pe_fecha_nacimiento: string;
    pe_genero: Genero;
}

export interface PersonaGrupoAsociarRequest {
    pe_codigo: number;
    gr_codigo: number;
}

export interface PersonaGrupo {
    id: number;
    personaId: number;
    grupoId: number;
}
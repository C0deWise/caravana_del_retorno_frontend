export interface RetornoData {
    re_fecha_creacion: string; // Fecha en formato ISO (YYYY-MM-DD)
}

export interface Retorno {
    re_codigo: string;
    re_fecha_creacion: string;
    re_año: number;
    re_estado: string;
}

export interface RetornoResponse {
    success: boolean;
    message: string;
    data?: Retorno;
}

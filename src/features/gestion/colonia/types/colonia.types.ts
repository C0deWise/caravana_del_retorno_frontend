export interface ColoniaData {
    co_pais: string;
    co_departamento: string;
    co_ciudad: string;
}

export interface ColoniaItem {
    co_codigo?: string;
    co_pais: string;
    co_departamento: string;
    co_ciudad: string;
}

export interface ColoniaResponse<TData = unknown> {
    success: boolean;
    message: string;
    data?: TData;
}

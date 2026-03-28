export interface ColoniaData {
    pais: string;
    departamento: string | null;
    ciudad: string | null;
}

export interface ColoniaItem {
    codigo?: string;
    pais: string;
    departamento: string | null;
    ciudad: string | null;
}

export interface ColoniaResponse<TData = unknown> {
    success: boolean;
    message: string;
    data?: TData;
}

export interface ColoniaData {
    co_pais: string;
    co_departamento: string;
    co_ciudad: string;
}

export interface ColoniaResponse {
    success: boolean;
    message: string;
    data?: {
        co_codigo?: string;
        co_pais?: string;
        co_departamento?: string;
        co_ciudad?: string;
    };
}

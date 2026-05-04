export type ReturnRegistrationAnswer = 0 | 1;

export interface ReturnRegistrationCreateRequest {
    usuario: number;
    retorno: number;
    num_hospedaje: number;
    num_transporte: number;
    num_parqueadero: number;
    note?: string;
}

export interface ReturnRegistrationApi {
    id: number;
    usuario: number;
    retorno: number;
    num_hospedaje: number;
    num_transporte: number;
    num_parqueadero: number;
    note?: string;
}
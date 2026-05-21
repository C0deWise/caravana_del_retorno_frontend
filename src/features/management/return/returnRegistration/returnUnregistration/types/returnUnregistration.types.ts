export type ReturnUnregistrationAnswer = 0 | 1;

export interface ReturnUnregistrationCreateRequest {
    usuario: number;
    retorno: number;
}

export interface ReturnUnregistrationApi {
    usuario: number;
    retorno: number;
}
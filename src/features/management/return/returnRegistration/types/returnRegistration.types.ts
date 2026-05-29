export type ReturnRegistrationAnswer = 0 | 1;

export interface ReturnRegistrationCreateRequest {
    usuario: number;
    retorno: number;
    num_hospedaje: number;
    num_transporte: number;
    num_parqueadero_carro: number;
    num_parqueadero_moto: number;
    anotacion?: string;
}

export interface ReturnRegistrationApi {
    codigo: number;
    usuario: number;
    retorno: number;
    num_hospedaje: number;
    num_transporte: number;
    num_parqueadero_carro: number;
    num_parqueadero_moto: number;
    anotacion?: string;
}
export interface RegistrationData {
    codigo: string;
    tipo_doc: string;
    documento: string;
    celular: string;
    nombre: string;
    apellido: string;
    genero: string;
    fecha_nacimiento: string;
    pais: string;
    departamento: string;
    ciudad: string;
    email?: string;
    password?: string;
    confirmEmail?: string;
    confirmPassword?: string;
}

export interface RegistrationResponse {
    success: boolean;
    message: string;
    data?: unknown;
}

export interface DocumentValidationResponse {
    valido: boolean;
    mensaje: string;
}
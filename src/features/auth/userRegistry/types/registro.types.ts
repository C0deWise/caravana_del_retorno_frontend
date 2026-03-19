export interface RegistrationData {
    us_codigo: string;
    us_tipo_doc: string;
    us_documento: string;
    us_celular: string;
    us_nombre: string;
    us_apellido: string;
    us_genero: string;
    us_fecha_nacimiento: string;
    us_pais: string;
    us_departamento: string;
    us_ciudad: string;
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
export interface UserData {
    us_codigo: string;
    us_tipo_doc: string;
    us_documento: string;
    us_celular: string;
    co_codigo: string;
    us_nombre: string;
    us_apellido: string;
    us_genero: string;
    us_fecha_nacimiento: string;
    us_pais: string;
    us_departamento: string;
    us_ciudad: string;
    us_email?: string;
}

export interface UserResponse {
    success: boolean;
    message: string;
    data?: UserData;
}
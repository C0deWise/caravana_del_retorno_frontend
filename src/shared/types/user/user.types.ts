export interface UserData {
    codigo: string;
    tipo_doc: string;
    documento: string;
    celular: string;
    colonia: string;
    nombre: string;
    apellido: string;
    genero: string;
    rol: string;
    fecha_nacimiento: string;
    pais: string;
    departamento: string;
    ciudad: string;
    email?: string;
}

export interface UserResponse {
    success: boolean;
    message: string;
    data?: UserData;
}
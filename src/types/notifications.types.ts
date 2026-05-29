export interface NotificationApi {
  codigo: number;
  mensaje: string;
  codigo_receptor: number;
  evento: {
    codigo: number;
    nombre: string;
    descripcion: string;
  };
  time_stamp: string;
  estado: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

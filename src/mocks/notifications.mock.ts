import { NotificationItem } from "@/types/notifications.types";

export const getMockNotifications = (): NotificationItem[] => [
  {
    id: "1",
    title: "Bienvenido",
    message: "Te damos la bienvenida a la plataforma de la Caravana del Retorno.",
    date: "Hace 5 min",
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "Actualización de perfil",
    message: "Recuerda completar la información de tu perfil para continuar.",
    date: "Hace 1 hora",
    read: false,
    type: "info",
  },
  {
    id: "3",
    title: "Mantenimiento programado",
    message: "El sistema estará en mantenimiento el domingo a las 00:00 horas.",
    date: "Hace 1 día",
    read: true,
    type: "warning",
  },
];

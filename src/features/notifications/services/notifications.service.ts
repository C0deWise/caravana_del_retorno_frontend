import { NotificationItem, NotificationApi } from "@/types/notifications.types";
import { apiService } from "@/services/api.services";

const mapNotification = (n: NotificationApi): NotificationItem => ({
  id: n.codigo.toString(),
  title: n.evento?.nombre || "Notificación",
  message: n.mensaje,
  date: new Date(n.time_stamp).toLocaleDateString("es-CO", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
  read: n.estado === "Leída",
  type: "info",
});

export const notificationsService = {
  getUnreadNotifications: async (userId: number): Promise<NotificationItem[]> => {
    const data = await apiService.get<NotificationApi[]>(`/api/v1/notificaciones/usuario/${userId}/no-leidas`);
    return Array.isArray(data) ? data.map(mapNotification) : [];
  },

  markAsRead: async (id: number): Promise<void> => {
    await apiService.put(`/api/v1/notificaciones/${id}/marcar-leida`);
  },

  markAllAsRead: async (userId: number): Promise<void> => {
    await apiService.put(`/api/v1/notificaciones/usuario/${userId}/marcar-leidas`);
  },
};

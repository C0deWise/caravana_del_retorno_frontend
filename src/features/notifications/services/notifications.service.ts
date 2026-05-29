import { NotificationItem } from "@/types/notifications.types";

export const notificationsService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    // TODO: Implement actual API call here
    return [];
  },

  markAsRead: async (id: string): Promise<void> => {
    // TODO: Implement actual API call here
  },

  markAllAsRead: async (): Promise<void> => {
    // TODO: Implement actual API call here
  },
};

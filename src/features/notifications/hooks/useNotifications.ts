import { useState, useEffect, useCallback } from "react";
import { NotificationItem } from "@/types/notifications.types";
import { notificationsService } from "../services/notifications.service";
import { useAuth } from "@/auth/context/AuthContext";

export function useNotifications() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await notificationsService.getUnreadNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch notifications"));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await notificationsService.markAllAsRead(user.id);
      await fetchNotifications();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to mark all as read"));
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(Number(id));
      await fetchNotifications();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to mark notification as read"));
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAllAsRead,
    markAsRead,
    refreshNotifications: fetchNotifications,
  };
}

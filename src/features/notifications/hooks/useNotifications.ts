import { useState, useEffect, useCallback } from "react";
import { NotificationItem } from "@/types/notifications.types";
import { notificationsService } from "../services/notifications.service";
import { useDev } from "@/features/dev/context/DevContext";
import { getMockNotifications } from "@/mocks/notifications.mock";

export function useNotifications(useMocks?: boolean) {
  const { featureFlags } = useDev();
  const effectiveUseMocks = useMocks ?? featureFlags.USE_NOTIFICATION_MOCKS;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (effectiveUseMocks) {
        setNotifications(getMockNotifications());
      } else {
        const data = await notificationsService.getNotifications();
        setNotifications(data);
      }
    } catch (err) {
      // TODO: Implement error codes
      setError(err instanceof Error ? err : new Error("Failed to fetch notifications"));
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveUseMocks]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    try {
      if (effectiveUseMocks) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } else {
        await notificationsService.markAllAsRead();
        await fetchNotifications();
      }
    } catch (err) {
      // TODO: Implement error codes
      console.error("Error marking all notifications as read:", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      if (effectiveUseMocks) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      } else {
        await notificationsService.markAsRead(id);
        await fetchNotifications();
      }
    } catch (err) {
      // TODO: Implement error codes
      console.error(`Error marking notification ${id} as read:`, err);
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

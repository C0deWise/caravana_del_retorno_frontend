export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

export type NotificationType =
  | "verification_submitted"
  | "verification_approved"
  | "verification_rejected"
  | "reupload_required"
  | "provider_license_submitted"
  | "provider_license_approved"
  | "provider_license_rejected"
  | "admin_review_required";

export type NotificationRole = "user" | "provider" | "admin";

export interface AppNotification {
  id: string;
  recipientId: string;
  recipientRole: NotificationRole;
  title: string;
  message: string;
  notificationType: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: AppNotification[];
  unreadCount: number;
}

import { NotificationType } from "../../constants/notification";
import { Role } from "../../constants/roles";

export interface NotificationDTO {
  id: string;
  recipientId: string;
  recipientRole: Role;
  title: string;
  message: string;
  notificationType: NotificationType;
  isRead: boolean;
  createdAt: string;
}

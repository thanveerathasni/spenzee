import { INotification } from "../../../models/Notification.model";
import { NotificationDTO } from "../../dto/notification/notification.dto";

export class NotificationMapper {
  static toDTO(notification: INotification): NotificationDTO {
    return {
      id: notification._id.toString(),
      recipientId: notification.recipientId.toString(),
      recipientRole: notification.recipientRole,
      title: notification.title,
      message: notification.message,
      notificationType: notification.notificationType,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}

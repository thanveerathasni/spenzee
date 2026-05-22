import { EventEmitter } from "events";
import { Role } from "../../shared/constants/roles";
import { NotificationDTO } from "../../shared/dto/notification/notification.dto";

const emitter = new EventEmitter();
const eventName = (recipientId: string, recipientRole: Role) =>
  `notification:${recipientRole}:${recipientId}`;

export const notificationStream = {
  publish(notification: NotificationDTO): void {
    emitter.emit(
      eventName(notification.recipientId, notification.recipientRole),
      notification,
    );
  },

  subscribe(
    recipientId: string,
    recipientRole: Role,
    listener: (notification: NotificationDTO) => void,
  ): () => void {
    const name = eventName(recipientId, recipientRole);

    emitter.on(name, listener);

    return () => {
      emitter.off(name, listener);
    };
  },
};

import {
  Document,
  model,
  Schema,
  Types,
} from "mongoose";

import {
  NotificationType,
  NOTIFICATION_TYPES,
} from "../shared/constants/notification";

import {
  Role,
  ROLES,
} from "../shared/constants/roles";

export interface INotification
  extends Document {
  recipientId: Types.ObjectId;

  recipientRole: Role;

  title: string;

  message: string;

  notificationType: NotificationType;

  isRead: boolean;

  createdAt: Date;
}

const notificationSchema =
  new Schema<INotification>(
    {
      recipientId: {
        type:
          Schema.Types.ObjectId,
        required: true,
      },

      recipientRole: {
        type: String,
        enum:
          Object.values(
            ROLES,
          ),
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      notificationType: {
        type: String,
        enum:
          Object.values(
            NOTIFICATION_TYPES,
          ),
        required: true,
      },

      isRead: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
    },
  );

/* ====================================================== */
/* INDEXES */
/* ====================================================== */

notificationSchema.index({
  recipientId: 1,
  recipientRole: 1,
});

notificationSchema.index({
  isRead: 1,
});

notificationSchema.index({
  createdAt: -1,
});

export const NotificationModel =
  model<INotification>(
    "Notification",
    notificationSchema,
  );
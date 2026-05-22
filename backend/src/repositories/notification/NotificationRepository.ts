import { injectable } from "inversify";

import { Types } from "mongoose";

import {
  INotification,
  NotificationModel,
} from "../../models/Notification.model";

import {
  CreateNotificationData,
  INotificationRepository,
} from "../../types/repositories/notification/INotificationRepository";

import { Role } from "../../shared/constants/roles";

@injectable()
export class NotificationRepository
  implements INotificationRepository
{
  /* ====================================================== */
  /* CREATE */
  /* ====================================================== */

  async create(
    data: CreateNotificationData,
  ): Promise<INotification> {
    return NotificationModel.create(
      data,
    );
  }

  /* ====================================================== */
  /* LIST */
  /* ====================================================== */

  async findByRecipient(
    recipientId: string,
    recipientRole: Role,
  ): Promise<INotification[]> {
    return NotificationModel.find({
      recipientId,
      recipientRole,
    })
      .sort({
        createdAt: -1,
      })
      .lean()
      .exec();
  }

  /* ====================================================== */
  /* UNREAD COUNT */
  /* ====================================================== */

  async countUnread(
    recipientId: string,
    recipientRole: Role,
  ): Promise<number> {
    return NotificationModel.countDocuments(
      {
        recipientId,
        recipientRole,
        isRead: false,
      },
    ).exec();
  }

  /* ====================================================== */
  /* MARK SINGLE READ */
  /* ====================================================== */

  async markRead(
    notificationId: string,
    recipientId: string,
  ): Promise<INotification | null> {
    if (
      !Types.ObjectId.isValid(
        notificationId,
      )
    ) {
      return null;
    }

    return NotificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        recipientId,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    ).exec();
  }

  /* ====================================================== */
  /* MARK ALL READ */
  /* ====================================================== */

  async markAllRead(
    recipientId: string,
    recipientRole: Role,
  ): Promise<void> {
    await NotificationModel.updateMany(
      {
        recipientId,
        recipientRole,
        isRead: false,
      },
      {
        isRead: true,
      },
    ).exec();
  }
}
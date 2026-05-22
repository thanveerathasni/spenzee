import { inject, injectable } from "inversify";

import { Types } from "mongoose";

import { TYPES } from "../../di/types";

import {
  NOTIFICATION_TYPES,
  NotificationType,
} from "../../shared/constants/notification";

import {
  Role,
  ROLES,
} from "../../shared/constants/roles";

import { NotificationDTO } from "../../shared/dto/notification/notification.dto";

import { NotificationMapper } from "../../shared/mapper/notification/NotificationMapper";
import { notificationStream } from "./notificationStream";

import { IAdminRepository } from "../../types/repositories/admin/IAdminRepository";

import {
  INotificationRepository,
} from "../../types/repositories/notification/INotificationRepository";

interface NotificationPayload {
  recipientId: string;

  recipientRole: Role;

  title: string;

  message: string;

  notificationType: NotificationType;
}

@injectable()
export class NotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private readonly _notificationRepository: INotificationRepository,

    @inject(TYPES.AdminRepository)
    private readonly _adminRepository: IAdminRepository,
  ) {}

  /* ====================================================== */
  /* CREATE */
  /* ====================================================== */

  async create(
    payload: NotificationPayload,
  ): Promise<NotificationDTO> {
    const notification =
      await this._notificationRepository.create(
        {
          ...payload,

          recipientId:
            new Types.ObjectId(
              payload.recipientId,
            ),
        },
      );

    const dto = NotificationMapper.toDTO(
      notification,
    );

    notificationStream.publish(
      dto,
    );

    return dto;
  }

  /* ====================================================== */
  /* ADMIN NOTIFICATIONS */
  /* ====================================================== */

  async notifyAdmins(
    title: string,
    message: string,
  ): Promise<void> {
    const admins =
      await this._adminRepository.findActiveAdmins();

    const notifications =
      await Promise.all(
      admins.map((admin) =>
        this._notificationRepository.create(
          {
            recipientId:
              admin._id,

            recipientRole:
              ROLES.ADMIN,

            title,

            message,

            notificationType:
              NOTIFICATION_TYPES.ADMIN_REVIEW_REQUIRED,
          },
        ),
      ),
    );

    notifications
      .map(NotificationMapper.toDTO)
      .forEach((notification) =>
        notificationStream.publish(
          notification,
        ),
      );
  }

  /* ====================================================== */
  /* LIST */
  /* ====================================================== */

  async listForRecipient(
    recipientId: string,
    recipientRole: Role,
  ): Promise<NotificationDTO[]> {
    const notifications =
      await this._notificationRepository.findByRecipient(
        recipientId,
        recipientRole,
      );

    return notifications.map(
      NotificationMapper.toDTO,
    );
  }

  /* ====================================================== */
  /* UNREAD COUNT */
  /* ====================================================== */

  async getUnreadCount(
    recipientId: string,
    recipientRole: Role,
  ): Promise<number> {
    return this._notificationRepository.countUnread(
      recipientId,
      recipientRole,
    );
  }

  /* ====================================================== */
  /* MARK SINGLE READ */
  /* ====================================================== */

  async markRead(
    notificationId: string,
    recipientId: string,
  ): Promise<NotificationDTO | null> {
    const notification =
      await this._notificationRepository.markRead(
        notificationId,
        recipientId,
      );

    return notification
      ? NotificationMapper.toDTO(
          notification,
        )
      : null;
  }

  /* ====================================================== */
  /* MARK ALL READ */
  /* ====================================================== */

  async markAllRead(
    recipientId: string,
    recipientRole: Role,
  ): Promise<void> {
    await this._notificationRepository.markAllRead(
      recipientId,
      recipientRole,
    );
  }
}

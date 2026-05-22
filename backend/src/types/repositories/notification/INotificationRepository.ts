import { Types } from "mongoose";

import { INotification } from "../../../models/Notification.model";

import { NotificationType } from "../../../shared/constants/notification";

import { Role } from "../../../shared/constants/roles";

export interface CreateNotificationData {
  recipientId: Types.ObjectId;

  recipientRole: Role;

  title: string;

  message: string;

  notificationType: NotificationType;
}

export interface INotificationRepository {
  create(
    data: CreateNotificationData,
  ): Promise<INotification>;

  findByRecipient(
    recipientId: string,
    recipientRole: Role,
  ): Promise<INotification[]>;

  countUnread(
    recipientId: string,
    recipientRole: Role,
  ): Promise<number>;

  markRead(
    notificationId: string,
    recipientId: string,
  ): Promise<INotification | null>;

  markAllRead(
    recipientId: string,
    recipientRole: Role,
  ): Promise<void>;
}
import {
  Request,
  Response,
} from "express";

import {
  inject,
  injectable,
} from "inversify";

import {
  TYPES,
} from "../../di/types";

import {
  NotificationService,
} from "../../services/notification/NotificationService";

import {
  notificationStream,
} from "../../services/notification/notificationStream";

import {
  ERROR_MESSAGES,
} from "../../shared/constants/errorMessages";

import {
  UnauthorizedError,
} from "../../shared/errors/errors";

import {
  sendResponse,
} from "../../shared/utils/sendResponse";

import {
  verifyAccessToken,
} from "../../shared/utils/token.util";

@injectable()
export class NotificationController {
  constructor(
    @inject(
      TYPES.NotificationService,
    )
    private readonly _notificationService: NotificationService,
  ) {}

  /* ====================================================== */
  /* LIST */
  /* ====================================================== */

  async list(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const user =
      this.getUser(req);

    const notifications =
      await this._notificationService.listForRecipient(
        user.id,
        user.role,
      );

    const unreadCount =
      await this._notificationService.getUnreadCount(
        user.id,
        user.role,
      );

    return sendResponse({
      res,

      message:
        "Notifications fetched successfully",

      data: {
        notifications,
        unreadCount,
      },
    });
  }

  /* ====================================================== */
  /* MARK READ */
  /* ====================================================== */

  async markRead(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const user =
      this.getUser(req);

    const notification =
      await this._notificationService.markRead(
        req.params.id,
        user.id,
      );

    return sendResponse({
      res,

      message:
        "Notification marked as read",

      data: notification,
    });
  }

  /* ====================================================== */
  /* MARK ALL READ */
  /* ====================================================== */

  async markAllRead(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const user =
      this.getUser(req);

    await this._notificationService.markAllRead(
      user.id,
      user.role,
    );

    return sendResponse({
      res,

      message:
        "Notifications marked as read",
    });
  }

  /* ====================================================== */
  /* SSE STREAM */
  /* ====================================================== */

  async stream(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      let token = String(
        req.query.token ?? "",
      );

      if (
        token.startsWith(
          "Bearer ",
        )
      ) {
        token =
          token.replace(
            "Bearer ",
            "",
          );
      }

      if (!token) {
        res.status(401).end();
        return;
      }

      const payload =
        verifyAccessToken(
          token,
        );

      res.setHeader(
        "Content-Type",
        "text/event-stream",
      );

      res.setHeader(
        "Cache-Control",
        "no-cache",
      );

      res.setHeader(
        "Connection",
        "keep-alive",
      );

      res.flushHeaders?.();

      res.write(
        `event: connected\n`,
      );

      res.write(
        `data: ${JSON.stringify({
          ok: true,
        })}\n\n`,
      );

      const unsubscribe =
        notificationStream.subscribe(
          payload.userId,
          payload.role,
          (
            notification,
          ) => {
            res.write(
              `event: notification\n`,
            );

            res.write(
              `data: ${JSON.stringify(
                notification,
              )}\n\n`,
            );
          },
        );

      const heartbeat =
        setInterval(
          () => {
            res.write(
              `event: heartbeat\n`,
            );

            res.write(
              `data: ${JSON.stringify({
                at: Date.now(),
              })}\n\n`,
            );
          },
          30000,
        );

      req.on(
        "close",
        () => {
          clearInterval(
            heartbeat,
          );

          unsubscribe();

          res.end();
        },
      );
    } catch (error) {
      res.status(401).end();
    }
  }

  /* ====================================================== */
  /* GET USER */
  /* ====================================================== */

  private getUser(
    req: Request,
  ) {
    if (!req.user) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .ACCESS_DENIED,
      );
    }

    return req.user;
  }
}
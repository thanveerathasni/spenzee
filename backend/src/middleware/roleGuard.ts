




import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  ERROR_MESSAGES,
} from "../shared/constants/errorMessages";

import {
  LOG_MESSAGES,
} from "../shared/constants/logMessages";

import {
  Role,
} from "../shared/constants/roles";

import {
  UnauthorizedError,
} from "../shared/errors/errors";

import { logger } from "../shared/logger/logger";

export const roleGuard =
  (
    allowedRoles: Role[],
  ) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError(
          ERROR_MESSAGES.AUTH
            .ACCESS_DENIED,
        );
      }

      const hasAccess =
        allowedRoles.includes(
          req.user.role,
        );

      if (!hasAccess) {
        logger.warn(
          LOG_MESSAGES.AUTH
            .AUTHORIZATION_FAILED,
          {
            userId:
              req.user.id,
            role:
              req.user.role,
            allowedRoles,
          },
        );

        throw new UnauthorizedError(
          ERROR_MESSAGES.AUTH
            .ACCESS_DENIED,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
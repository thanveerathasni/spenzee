







import {
  Request,
  Response,
  NextFunction,
} from "express";

import { AdminModel } from "../models/Admin.model";

import {
  ProviderModel,
  ProviderStatus,
} from "../models/Provider.model";

import { UserModel } from "../models/User.model";

import { ERROR_MESSAGES } from "../shared/constants/errorMessages";

import {
  LOG_MESSAGES,
} from "../shared/constants/logMessages";

import {
  Role,
  ROLES,
} from "../shared/constants/roles";

import {
  UnauthorizedError,
} from "../shared/errors/errors";

import { logger } from "../shared/logger/logger";

import {
  JwtPayload,
  verifyAccessToken,
} from "../shared/utils/token.util";

interface AuthenticatedUser {
  id: string;
  role: Role;
}

export const authGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token =
      extractBearerToken(
        req.headers.authorization,
      );

    const payload =
      verifyAccessToken(token);

    await validateAccountState(
      payload,
    );

    req.user = {
      id: payload.userId,
      role: payload.role,
    } as AuthenticatedUser;

    next();
  } catch (error: unknown) {
    logger.warn(
      LOG_MESSAGES.AUTH
        .AUTHORIZATION_FAILED,
      {
        error:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.AUTH
                .ACCESS_DENIED,
      },
    );

    next(
      new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .ACCESS_DENIED,
      ),
    );
  }
};

/* ====================================================== */
/* TOKEN EXTRACTION */
/* ====================================================== */

const extractBearerToken = (
  authorization?: string,
): string => {
  if (
    !authorization ||
    !authorization.startsWith(
      "Bearer ",
    )
  ) {
    throw new UnauthorizedError(
      ERROR_MESSAGES.AUTH
        .ACCESS_DENIED,
    );
  }

  return authorization.split(
    " ",
  )[1];
};

/* ====================================================== */
/* ACCOUNT VALIDATION */
/* ====================================================== */

const validateAccountState =
  async (
    payload: JwtPayload,
  ): Promise<void> => {
    switch (payload.role) {
      case ROLES.ADMIN:
        await validateAdmin(
          payload.userId,
        );
        break;

      case ROLES.PROVIDER:
        await validateProvider(
          payload.userId,
        );
        break;

      case ROLES.USER:
        await validateUser(
          payload.userId,
        );
        break;

      default:
        throw new UnauthorizedError(
          ERROR_MESSAGES.AUTH
            .ACCESS_DENIED,
        );
    }
  };

/* ====================================================== */
/* USER VALIDATION */
/* ====================================================== */

const validateUser = async (
  userId: string,
): Promise<void> => {
  const user =
    await UserModel.findById(
      userId,
    ).exec();

  if (
    !user ||
    !user.isActive
  ) {
    throw new UnauthorizedError(
      ERROR_MESSAGES.AUTH
        .ACCOUNT_BLOCKED,
    );
  }
};

/* ====================================================== */
/* PROVIDER VALIDATION */
/* ====================================================== */

const validateProvider =
  async (
    providerId: string,
  ): Promise<void> => {
    const provider =
      await ProviderModel.findById(
        providerId,
      ).exec();

    if (!provider) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    if (
      provider.status !==
      ProviderStatus.ACTIVE
    ) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .ACCOUNT_BLOCKED,
      );
    }
  };

/* ====================================================== */
/* ADMIN VALIDATION */
/* ====================================================== */

const validateAdmin =
  async (
    adminId: string,
  ): Promise<void> => {
    const admin =
      await AdminModel.findById(
        adminId,
      ).exec();

    if (
      !admin ||
      !admin.isActive
    ) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .ACCOUNT_BLOCKED,
      );
    }
  };

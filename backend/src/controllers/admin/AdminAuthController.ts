import {
  Request,
  Response,
} from "express";

import {
  injectable,
  inject,
} from "inversify";

import {
  TYPES,
} from "../../di/types";

import {
  LOG_MESSAGES,
} from "../../shared/constants/logMessages";

import {
  SUCCESS_MESSAGES,
} from "../../shared/constants/successMessages";

import {
  ERROR_MESSAGES,
} from "../../shared/constants/errorMessages";

import {
  logger,
} from "../../shared/logger/logger";

import {
  sendResponse,
} from "../../shared/utils/sendResponse";

import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../../shared/utils/cookies";

import {
  UnauthorizedError,
} from "../../shared/errors/errors";

import {
  IAdminAuthService,
} from "../../types/services/admin/IAdminAuthService";

@injectable()
export class AdminAuthController {
  constructor(
    @inject(
      TYPES.AdminAuthService,
    )
    private readonly _service: IAdminAuthService,
  ) {}

  /* ============================================== */
  /* LOGIN */
  /* ============================================== */

  async login(
    req: Request,
    res: Response,
  ) {
    const {
      email,
      password,
    } = req.body;

    logger.info(
      LOG_MESSAGES.ADMIN.LOGIN_ATTEMPT,
      { email },
    );

    const data =
      await this._service.login(
        email,
        password,
      );

    setRefreshTokenCookie(
      res,
      data.refreshToken,
    );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.ADMIN.LOGIN_SUCCESS,

      data: {
        accessToken:
          data.accessToken,

        admin:
          data.admin,
      },
    });
  }

  /* ============================================== */
  /* REFRESH */
  /* ============================================== */

  async refresh(
    req: Request,
    res: Response,
  ) {
    const refreshToken =
      req.cookies?.refreshToken;

    /* ============================================== */
    /* NO TOKEN */
    /* ============================================== */

    if (
      !refreshToken
    ) {
      logger.warn(
        ERROR_MESSAGES.AUTH
          .REFRESH_TOKEN_REQUIRED,
      );

      res.status(401);

      return sendResponse({
        res,

        message:
          ERROR_MESSAGES.AUTH
            .REFRESH_TOKEN_REQUIRED,
      });
    }

    /* ============================================== */
    /* REFRESH */
    /* ============================================== */

    const data =
      await this._service.refresh(
        refreshToken,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.AUTH
          .TOKEN_REFRESHED,

      data,
    });
  }

  /* ============================================== */
  /* LOGOUT */
  /* ============================================== */

  async logout(
    _req: Request,
    res: Response,
  ) {
    clearRefreshTokenCookie(
      res,
    );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.AUTH
          .LOGOUT_SUCCESS,
    });
  }
}
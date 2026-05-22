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
} from "../../../di/types";

import {
  LOG_MESSAGES,
} from "../../../shared/constants/logMessages";

import {
  SUCCESS_MESSAGES,
} from "../../../shared/constants/successMessages";

import { logger } from "../../../shared/logger/logger";

import { sendResponse } from "../../../shared/utils/sendResponse";

import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../../../shared/utils/cookies";

import {
  UnauthorizedError,
} from "../../../shared/errors/errors";

import {
  ERROR_MESSAGES,
} from "../../../shared/constants/errorMessages";

import { IProviderAuthService } from "../../../types/services/provider/IProviderAuthService";

@injectable()
export class ProviderAuthController {
  constructor(
    @inject(
      TYPES.ProviderAuthService,
    )
    private readonly _service: IProviderAuthService,
  ) {}

  /* ====================================================== */
  /* LOGIN */
  /* ====================================================== */

  async login(
    req: Request,
    res: Response,
  ) {
    const {
      email,
      password,
    } = req.body;

    logger.info(
      LOG_MESSAGES.PROVIDER.LOGIN_ATTEMPT,
      { email },
    );

    const data =
      await this._service.login(
        email,
        password,
      );

    /* ============================================== */
    /* SET REFRESH COOKIE */
    /* ============================================== */

    setRefreshTokenCookie(
      res,
      data.refreshToken,
    );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER.LOGIN_SUCCESS,

      data: {
        accessToken:
          data.accessToken,

        provider:
          data.provider,
      },
    });
  }

  /* ====================================================== */
  /* REFRESH */
  /* ====================================================== */

  async refresh(
    req: Request,
    res: Response,
  ) {
    const refreshToken =
      req.cookies?.refreshToken;

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

  /* ====================================================== */
  /* LOGOUT */
  /* ====================================================== */

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

  /* ====================================================== */
  /* SETUP PASSWORD */
  /* ====================================================== */

  async setupPassword(
    req: Request,
    res: Response,
  ) {
    const {
      token,
      newPassword,
    } = req.body;

    logger.info(
      LOG_MESSAGES.PROVIDER
        .PASSWORD_SETUP,
    );

    await this._service.setupPassword(
      token,
      newPassword,
    );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .PASSWORD_SETUP_SUCCESS,
    });
  }

  /* ====================================================== */
  /* FORGOT PASSWORD */
  /* ====================================================== */

  async forgotPassword(
    req: Request,
    res: Response,
  ) {
    const {
      email,
    } = req.body;

    await this._service.forgotPassword(
      email,
    );

    return sendResponse({
      res,

      message:
        "Password reset email sent",
    });
  }

  /* ====================================================== */
  /* RESET PASSWORD */
  /* ====================================================== */

  async resetPassword(
    req: Request,
    res: Response,
  ) {
    const {
      email,
      token,
      newPassword,
    } = req.body;

    await this._service.resetPassword(
      email,
      token,
      newPassword,
    );

    return sendResponse({
      res,

      message:
        "Password reset successful",
    });
  }

  /* ====================================================== */
  /* CHANGE PASSWORD */
  /* ====================================================== */

  async changePassword(
    req: Request,
    res: Response,
  ) {
    const providerId =
      req.user?.id;

    if (
      !providerId
    ) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .ACCESS_DENIED,
      );
    }

    const {
      oldPassword,
      newPassword,
    } = req.body;

    await this._service.changePassword(
      providerId,
      oldPassword,
      newPassword,
    );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .PASSWORD_CHANGED,
    });
  }
}
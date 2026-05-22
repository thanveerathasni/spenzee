import { Request, Response } from "express";

import { inject, injectable } from "inversify";

import { TYPES } from "../../di/types";

import { UserService } from "../../services/user/UserService";

import { OtpService } from "../../services/otp.service";

import {
  ERROR_MESSAGES,
} from "../../shared/constants/errorMessages";

import {
  LOG_MESSAGES,
} from "../../shared/constants/logMessages";

import {
  SUCCESS_MESSAGES,
} from "../../shared/constants/successMessages";

import {
  UnauthorizedError,
} from "../../shared/errors/errors";

import { logger } from "../../shared/logger/logger";

import { sendResponse } from "../../shared/utils/sendResponse";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService)
    private readonly _userService: UserService,

    @inject(TYPES.OtpService)
    private readonly _otpService: OtpService,
  ) {}

  /* ====================================================== */
  /* PROFILE */
  /* ====================================================== */

  async getProfile(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId =
      this.getUserId(req);

    logger.info(
      LOG_MESSAGES.USER
        .PROFILE_FETCHED,
      { userId },
    );

    const data =
      await this._userService.getProfile(
        userId,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.USER
          .PROFILE_FETCHED,

      data,
    });
  }

  async updateProfile(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId =
      this.getUserId(req);

    const data =
      await this._userService.updateProfile(
        userId,
        req.body,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.USER
          .PROFILE_UPDATED,

      data,
    });
  }

  /* ====================================================== */
  /* PROFILE IMAGE */
  /* ====================================================== */

  async uploadProfileImage(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId =
      this.getUserId(req);

    if (!req.file) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.USER
          .IMAGE_FILE_REQUIRED,
      );
    }

    const data =
      await this._userService.updateProfileImage(
        userId,
        req.file,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.USER
          .PROFILE_UPDATED,

      data,
    });
  }

  async removeProfileImage(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId =
      this.getUserId(req);

    const data =
      await this._userService.removeProfileImage(
        userId,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.USER
          .PROFILE_IMAGE_REMOVED,

      data,
    });
  }

  /* ====================================================== */
  /* EMAIL CHANGE */
  /* ====================================================== */

  async requestEmailChange(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { newEmail } =
      req.body;

    await this._otpService.sendOtp(
      newEmail,
    );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.USER
          .EMAIL_OTP_SENT,
    });
  }

  async confirmEmailChange(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId =
      this.getUserId(req);

    const {
      newEmail,
      otp,
    } = req.body;

    await this._otpService.verifyOtp(
      newEmail,
      otp,
    );

    await this._userService.updateEmail(
      userId,
      newEmail,
    );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.USER
          .EMAIL_UPDATED,

      data: {
        email: newEmail,
      },
    });
  }

  /* ====================================================== */
  /* HELPERS */
  /* ====================================================== */

  private getUserId(
    req: Request,
  ): string {
    const userId =
      req.user?.id;

    if (!userId) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .ACCESS_DENIED,
      );
    }

    return userId;
  }
}
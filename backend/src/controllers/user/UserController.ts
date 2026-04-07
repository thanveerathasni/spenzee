import { Request, Response } from "express";
import {Express} from "express";
import { inject, injectable } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../di/types";
import { OtpService } from "../../services/otp.service";
import { UserService } from "../../services/user/UserService";

import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages";

import { UnauthorizedError } from "../../shared/errors/errors";
import { logger } from "../../shared/logger/logger";
import { uploadToCloudinary } from "../../shared/utils/cloudinaryUpload";
import { sendResponse } from "../../shared/utils/sendResponse";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService)
    private readonly _userService: UserService,
@inject(TYPES.OtpService)
private readonly _otpService: OtpService
  ) {}

  async getProfile(req: Request, res: Response) {
    const userId = (req as Request & { user?: { id: string } }).user?.id;

    if (!userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    logger.info(LOG_MESSAGES.AUTH.LOGIN_ATTEMPT, { userId });

    const data = await this._userService.getProfile(userId);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
      data,
    });
  }

  async updateProfile(req: Request, res: Response) {
    const userId = (req as Request & { user?: { id: string } }).user?.id;

    if (!userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    const data = await this._userService.updateProfile(userId, req.body);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.USER.PROFILE_UPDATED,
      data,
    });
  }

  async uploadProfileImage(req: Request, res: Response) {
    const userId = (req as Request & { user?: { id: string } }).user?.id;

    if (!userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    if (!req.file) {
      throw new UnauthorizedError("Image file required");
    }

    const data = await this._userService.updateProfileImage(
      userId,
      req.file as Express.Multer.File
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.USER.PROFILE_UPDATED,
      data,
    });
  }



  // ✅ EMAIL CHANGE REQUEST
  async requestEmailChange(req: Request, res: Response) {
    try {
      const { newEmail } = req.body as { newEmail: string };

      await this._otpService.sendOtp(newEmail);

      return sendResponse({
        res,
        message: "OTP sent to new email",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      return sendResponse({
        res,
        message,
      });
    }
  }

  // ✅ EMAIL CHANGE CONFIRM
  async confirmEmailChange(req: Request, res: Response) {
    try {
      const userId = (req as Request & { user?: { id: string } }).user?.id;

      if (!userId) {
        throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
      }

      const { newEmail, otp } = req.body as {
        newEmail: string;
        otp: string;
      };

      await this._otpService.verifyOtp(newEmail, otp);

      await this._userService.updateEmail(userId, newEmail);

      return sendResponse({
        res,
        message: "Email updated successfully",
        data: { email: newEmail },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      return sendResponse({
        res,
        message,
      });
    }
  }
}











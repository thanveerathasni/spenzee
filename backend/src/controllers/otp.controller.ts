import {
  Request,
  Response,
} from "express";

import {
  inject,
  injectable,
} from "inversify";

import { TYPES } from "../di/types";

import {
  SUCCESS_MESSAGES,
} from "../shared/constants/successMessages";

import { sendResponse } from "../shared/utils/sendResponse";

import { OtpService } from "../services/otp.service";

@injectable()
export class OtpController {
  constructor(
    @inject(TYPES.OtpService)
    private readonly _otpService: OtpService,
  ) {}

  /* ====================================================== */
  /* SEND OTP */
  /* ====================================================== */

  async sendOtp(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { email } =
      req.body;

    await this._otpService.sendOtp(
      email,
    );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.AUTH
          .OTP_SENT,
    });
  }

  /* ====================================================== */
  /* VERIFY OTP */
  /* ====================================================== */

  async verifyOtp(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const {
      email,
      otp,
    } = req.body;

    await this._otpService.verifyOtp(
      email,
      otp,
    );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.AUTH
          .ACCOUNT_VERIFIED,
    });
  }
}
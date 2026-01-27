import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";

import { IAuthService } from "../types/services/IAuthService";
import { sendResponse } from "../utils/sendResponse";
import { SUCCESS_MESSAGES } from "../constants/successMessages";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/cookies";
import { TOKEN_CONFIG } from "../constants/token";

import {
  UnauthorizedError,
  BadRequestError,
} from "../utils/errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";

import { LoginDTO } from "../validators/auth/login.validator";
import { SignupDTO } from "../validators/auth/signup.validator";
import { VerifyOtpDTO } from "../validators/auth/verifyOtp.validator";
import { ResendOtpDTO } from "../validators/auth/resendOtp.validator";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: IAuthService
  ) {}

  // ======================
  // LOGIN
  // ======================
async login(req: Request, res: Response): Promise<Response> {
  const loginDto = req.body as LoginDTO;

  const { accessToken, refreshToken, user } =
    await this.authService.login(
      loginDto.email,
      loginDto.password
    );

  setRefreshTokenCookie(res, refreshToken);

  return sendResponse({
    res,
    message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
    data: {
      accessToken,
      user, 
    },
  });
}


  // ======================
  // REFRESH TOKEN
  // ======================
  async refresh(req: Request, res: Response): Promise<Response> {
    const refreshToken =
      req.cookies?.[TOKEN_CONFIG.COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.REFRESH_TOKEN_MISSING
      );
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
    } = await this.authService.refreshAccessToken(
      refreshToken
    );

    setRefreshTokenCookie(res, newRefreshToken);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.TOKEN_REFRESHED,
      data: { accessToken },
    });
  }

  // ======================
  // LOGOUT
  // ======================
  async logout(req: Request, res: Response): Promise<Response> {
    const refreshToken =
      req.cookies?.[TOKEN_CONFIG.COOKIE_NAME];

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    clearRefreshTokenCookie(res);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS,
    });
  }

  // ======================
  // SIGNUP
  // ======================
  async signup(req: Request, res: Response): Promise<Response> {
    const dto = req.body as SignupDTO;

    await this.authService.signup(dto.email, dto.password);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.OTP_SENT,
    });
  }

  // ======================
  // VERIFY OTP
  // ======================
  async verifyOtp(req: Request, res: Response): Promise<Response> {
    const dto = req.body as VerifyOtpDTO;

    await this.authService.verifyOtp(dto.email, dto.otp);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.ACCOUNT_VERIFIED,
    });
  }

  // ======================
  // RESEND OTP
  // ======================
  async resendOtp(req: Request, res: Response): Promise<Response> {
    const dto = req.body as ResendOtpDTO;

    await this.authService.resendOtp(dto.email);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.OTP_RESENT,
    });
  }

  // ======================
  // FORGOT PASSWORD
  // ======================
  async forgotPassword(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { email } = req.body;

    const resetToken =
      await this.authService.forgotPassword(email);

    // SECURITY: do not expose token in response
    if (resetToken) {
      await this.authService.sendResetPasswordEmail(
        email,
        resetToken
      );
    }

    return sendResponse({
      res,
      message:
        SUCCESS_MESSAGES.AUTH.PASSWORD_RESET_EMAIL_SENT,
    });
  }

  // ======================
  // RESET PASSWORD
  // ======================
  async resetPassword(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { token, newPassword } = req.body;

    await this.authService.resetPassword(
      token,
      newPassword
    );

    return sendResponse({
      res,
      message:
        SUCCESS_MESSAGES.AUTH.PASSWORD_RESET_SUCCESS,
    });
  }

  // ======================
  // GOOGLE LOGIN
  // ======================
  async googleLogin(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { credential } = req.body;

    if (!credential) {
      throw new BadRequestError(
        "Google credential missing"
      );
    }

    const { accessToken, refreshToken, user } =
      await this.authService.googleLogin(credential);

    setRefreshTokenCookie(res, refreshToken);

    return sendResponse({
      res,
      message: "Google login successful",
      data: { accessToken, user },
    });
  }
}

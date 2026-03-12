import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";


import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages";
import { TOKEN_CONFIG } from "../../shared/constants/token";

import { UnauthorizedError, BadRequestError } from "../../shared/errors/errors";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../../shared/utils/cookies";

import { sendResponse } from "../../shared/utils/sendResponse";
import { IAuthService } from "../../types/services/user/IAuthService";

import { LoginDTO } from "../../validators/auth/login.validator";
import { ResendOtpDTO } from "../../validators/auth/resendOtp.validator";
import { SignupDTO } from "../../validators/auth/signup.validator";
import { VerifyOtpDTO } from "../../validators/auth/verifyOtp.validator";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: IAuthService,
  ) {}

  async login(req: Request, res: Response): Promise<Response> {
    const loginDto = req.body as LoginDTO;

    const { accessToken, refreshToken, user } = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    setRefreshTokenCookie(res, refreshToken);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
      data: { accessToken, user },
    });
  }

  async refresh(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.cookies?.[TOKEN_CONFIG.COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_MISSING);
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    } = await this.authService.refreshAccessToken(refreshToken);

    setRefreshTokenCookie(res, newRefreshToken);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.TOKEN_REFRESHED,
      data: { accessToken, user },
    });
  }

  async logout(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.cookies?.[TOKEN_CONFIG.COOKIE_NAME];

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    clearRefreshTokenCookie(res);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS,
    });
  }

  async signup(req: Request, res: Response): Promise<Response> {
    const dto = req.body as SignupDTO;

    await this.authService.signup(dto.email, dto.password);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.OTP_SENT,
    });
  }

  async verifyOtp(req: Request, res: Response): Promise<Response> {
    const dto = req.body as VerifyOtpDTO;

    await this.authService.verifyOtp(dto.email, dto.otp);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.ACCOUNT_VERIFIED,
    });
  }

  async resendOtp(req: Request, res: Response): Promise<Response> {
    const dto = req.body as ResendOtpDTO;

    await this.authService.resendOtp(dto.email);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.OTP_RESENT,
    });
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const resetToken = await this.authService.forgotPassword(email);

    if (resetToken) {
      await this.authService.sendResetPasswordEmail(email, resetToken);
    }

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.PASSWORD_RESET_EMAIL_SENT,
    });
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const { token, newPassword } = req.body;

    await this.authService.resetPassword(token, newPassword);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.PASSWORD_RESET_SUCCESS,
    });
  }

  async googleLogin(req: Request, res: Response): Promise<Response> {
    const { credential } = req.body;

    if (!credential) {
      throw new BadRequestError(ERROR_MESSAGES.AUTH.GOOGLE_CREDENTIAL_MISSING);
    }

    const { accessToken, refreshToken, user } = await this.authService.googleLogin(credential);

    setRefreshTokenCookie(res, refreshToken);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.GOOGLE_LOGIN_SUCCESS,
      data: { accessToken, user },
    });
  }
}

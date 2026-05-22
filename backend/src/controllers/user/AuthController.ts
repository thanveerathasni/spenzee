import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";

import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages";
import { TOKEN_CONFIG } from "../../shared/constants/token";

import { UnauthorizedError, BadRequestError } from "../../shared/errors/errors";
import { logger } from "../../shared/logger/logger";

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
    private readonly _authService: IAuthService,
  ) {}

  async login(req: Request, res: Response): Promise<Response> {
    const dto = req.body as LoginDTO;

    logger.info(LOG_MESSAGES.AUTH.LOGIN_ATTEMPT, { email: dto.email });

    const { accessToken, refreshToken, user } =
      await this._authService.login(dto.email, dto.password);

    setRefreshTokenCookie(res, refreshToken);

    logger.info(LOG_MESSAGES.AUTH.LOGIN_SUCCESS, { userId: user.id });

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
      data: { accessToken, user },
    });
  }

  async refresh(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.cookies?.[TOKEN_CONFIG.COOKIE_NAME];

    if (!refreshToken) {
  logger.warn(
    ERROR_MESSAGES.AUTH
      .REFRESH_TOKEN_MISSING,
  );

  res.status(401);

  return sendResponse({
    res,

    message:
      ERROR_MESSAGES.AUTH
        .REFRESH_TOKEN_MISSING,
  });
}
    logger.info(LOG_MESSAGES.AUTH.TOKEN_REFRESH);

    const { accessToken, refreshToken: newToken, user } =
      await this._authService.refreshAccessToken(refreshToken);

    setRefreshTokenCookie(res, newToken);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.TOKEN_REFRESHED,
      data: { accessToken, user },
    });
  }

  async logout(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.cookies?.[TOKEN_CONFIG.COOKIE_NAME];

    logger.info(LOG_MESSAGES.AUTH.LOGOUT);

    if (refreshToken) {
      await this._authService.logout(refreshToken);
    }

    clearRefreshTokenCookie(res);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS,
    });
  }

  async signup(req: Request, res: Response): Promise<Response> {
    const dto = req.body as SignupDTO;

    logger.info(LOG_MESSAGES.EMAIL.OTP_SENT, { email: dto.email });

    await this._authService.signup(dto.email, dto.password);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.OTP_SENT,
    });
  }

  async verifyOtp(req: Request, res: Response): Promise<Response> {
    const dto = req.body as VerifyOtpDTO;

    logger.info(LOG_MESSAGES.EMAIL.OTP_SENT, { email: dto.email });

    await this._authService.verifyOtp(dto.email, dto.otp);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.ACCOUNT_VERIFIED,
    });
  }

  async resendOtp(req: Request, res: Response): Promise<Response> {
    const dto = req.body as ResendOtpDTO;

    logger.info(LOG_MESSAGES.AUTH.LOGIN_ATTEMPT, { email: dto.email });

    await this._authService.resendOtp(dto.email);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.OTP_RESENT,
    });
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    logger.info(LOG_MESSAGES.AUTH.LOGIN_ATTEMPT, { email });

    await this._authService.forgotPassword(email);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.PASSWORD_RESET_EMAIL_SENT,
    });
  }
  
async resetPassword(
  req: Request,
  res: Response,
): Promise<void> {
  const {
    email,
    token,
    newPassword,
  } = req.body;

  await this._authService.resetPassword(
    email,
    token,
    newPassword,
  );

  sendResponse({
    res,

    message:
      SUCCESS_MESSAGES.AUTH
        .PASSWORD_RESET_SUCCESS,
  });
}

async sendEmailOtp(req: Request, res: Response) {
  const { newEmail } = req.body;

  logger.info(LOG_MESSAGES.AUTH.EMAIL_CHANGE, { newEmail });

  await this._authService.sendEmailChangeOtp(newEmail);

  return sendResponse({
    res,
    message: SUCCESS_MESSAGES.USER.EMAIL_OTP_SENT,
  });
}

async verifyEmailOtp(req: Request, res: Response) {
  const { newEmail, otp } = req.body;

  await this._authService.verifyEmailChangeOtp(newEmail, otp);

  return sendResponse({
    res,
    message: SUCCESS_MESSAGES.AUTH.ACCOUNT_VERIFIED,
  });
}

async updateEmail(req: Request, res: Response) {
  const userId = req.user?.id;
  const { newEmail } = req.body;

  if (!userId) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }

  const user = await this._authService.updateEmail(userId, newEmail);

  return sendResponse({
    res,
    message: SUCCESS_MESSAGES.USER.EMAIL_UPDATED,
    data: user,
  });
}


async sendPasswordOtp(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }

  await this._authService.sendPasswordOtp(userId);

  return sendResponse({ res, message: SUCCESS_MESSAGES.AUTH.OTP_SENT });
}

async verifyPasswordOtp(req: Request, res: Response) {
  const userId = req.user?.id;
  const { otp } = req.body;

  if (!userId) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }

  await this._authService.verifyPasswordOtp(userId, otp);

  return sendResponse({ res, message: SUCCESS_MESSAGES.AUTH.ACCOUNT_VERIFIED });
}

async updatePassword(req: Request, res: Response) {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }

  await this._authService.updatePassword(userId, currentPassword, newPassword);

  return sendResponse({ res, message: SUCCESS_MESSAGES.USER.PASSWORD_UPDATED });
}



  async googleLogin(req: Request, res: Response): Promise<Response> {
    const { credential } = req.body;

    if (!credential) {
      logger.warn(ERROR_MESSAGES.AUTH.GOOGLE_CREDENTIAL_MISSING);
      throw new BadRequestError(ERROR_MESSAGES.AUTH.GOOGLE_CREDENTIAL_MISSING);
    }

    logger.info(LOG_MESSAGES.AUTH.LOGIN_ATTEMPT);

    const { accessToken, refreshToken, user } =
      await this._authService.googleLogin(credential);

    setRefreshTokenCookie(res, refreshToken);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.GOOGLE_LOGIN_SUCCESS,
      data: { accessToken, user },
    });
  }
}

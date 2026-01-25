import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IAuthService } from "../types/services/IAuthService";
import { sendResponse } from "../utils/sendResponse";
import { SUCCESS_MESSAGES } from "../constants/successMessages";
import { LoginDTO } from "../validators/auth/login.validator";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie
} from "../utils/cookies";
import { TOKEN_CONFIG } from "../constants/token";
import { UnauthorizedError } from "../utils/errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: IAuthService
  ) {}

  async login(req: Request, res: Response): Promise<Response> {
    const loginDto = req.body as LoginDTO;

    const { accessToken, refreshToken } =
      await this.authService.login(
        loginDto.email,
        loginDto.password
      );

    setRefreshTokenCookie(res, refreshToken);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
      data: { accessToken }
    });
  }

  async refresh(req: Request, res: Response): Promise<Response> {
    const refreshToken =
      req.cookies?.[TOKEN_CONFIG.COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.REFRESH_TOKEN_MISSING
      );
    }

    const { accessToken } =
      await this.authService.refreshAccessToken(
        refreshToken
      );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.TOKEN_REFRESHED,
      data: { accessToken }
    });
  }

  async logout(_req: Request, res: Response): Promise<Response> {
    clearRefreshTokenCookie(res);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS
    });
  }
}

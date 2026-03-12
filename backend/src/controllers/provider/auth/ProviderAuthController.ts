import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import { ProviderAuthService } from "../../../services/provider/auth/ProviderAuthService";
import { ProviderCredentialService } from "../../../services/provider/auth/ProviderCredentialService";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../shared/constants/successMessages";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class ProviderAuthController {
  constructor(
    @inject(TYPES.ProviderAuthService)
    private readonly providerAuthService: ProviderAuthService,

    @inject(TYPES.ProviderCredentialService)
    private readonly credentialService: ProviderCredentialService,
  ) {}

  // ================= LOGIN =================
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.BAD_REQUEST);
      }

      const result = await this.providerAuthService.login(email, password);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // ================= PASSWORD SETUP =================
  setupPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        throw new AppError(ERROR_MESSAGES.GENERAL.INVALID_REQUEST, HTTP_STATUS.BAD_REQUEST);
      }

      await this.credentialService.setupPassword(token, password);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PROVIDER.PASSWORD_SETUP_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };
}

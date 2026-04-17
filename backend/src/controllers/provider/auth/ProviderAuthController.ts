import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../../di/types";
import { ProviderAuthService } from "../../../services/provider/auth/ProviderAuthService";
import { LOG_MESSAGES } from "../../../shared/constants/logMessages";
import { SUCCESS_MESSAGES } from "../../../shared/constants/successMessages";
import { logger } from "../../../shared/logger/logger";
import { sendResponse } from "../../../shared/utils/sendResponse";
import { IProviderAuthService } from "../../../types/services/provider/IProviderAuthService"

@injectable()
export class ProviderAuthController {
  constructor(
    @inject(TYPES.ProviderAuthService)
    private readonly _service: IProviderAuthService
  ) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    logger.info(LOG_MESSAGES.PROVIDER.LOGIN_ATTEMPT, { email });

    const data = await this._service.login(email, password);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PROVIDER.LOGIN_SUCCESS,
      data,
    });
  }

  async setupPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    logger.info(LOG_MESSAGES.PROVIDER.PASSWORD_SETUP);

    await this._service.setupPassword(token, password);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PROVIDER.PASSWORD_SETUP_SUCCESS,
    });
  }

  async changePassword(req: Request, res: Response) {
    const providerId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    logger.info(`Provider password change attempt for id: ${providerId}`);

    await this._service.changePassword(providerId!, oldPassword, newPassword);

    return sendResponse({
      res,
      message: "Password changed successfully",
    });
  }
}
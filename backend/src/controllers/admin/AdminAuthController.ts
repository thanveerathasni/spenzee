import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";

import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages";
import { logger } from "../../shared/logger/logger";
import { sendResponse } from "../../shared/utils/sendResponse";
import { IAdminAuthService } from "../../types/services/admin/IAdminAuthService";

@injectable()
export class AdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService)
    private readonly _service: IAdminAuthService
  ) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    logger.info(LOG_MESSAGES.ADMIN.LOGIN_ATTEMPT, { email });

    const data = await this._service.login(email, password);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.ADMIN.LOGIN_SUCCESS,
      data,
    });
  }
}
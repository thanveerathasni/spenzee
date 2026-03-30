import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages";
import { logger } from "../../shared/logger/logger";
import { sendResponse } from "../../shared/utils/sendResponse";

import { IProviderService } from "../../types/services/provider/IProviderService";


@injectable()
export class ProviderController {
  constructor(
    @inject(TYPES.ProviderService)
    private readonly _providerService: IProviderService
  ) {}

  async getDashboard(req: Request, res: Response) {
    const providerId = req.user?.id;

    logger.info(LOG_MESSAGES.PROVIDER.DASHBOARD_ACCESSED, { providerId });

    const data = await this._providerService.createProvider({ id: providerId! });

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PROVIDER.DASHBOARD_FETCHED,
      data,
    });
  }
}
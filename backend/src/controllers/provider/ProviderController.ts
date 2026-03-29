import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";
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

    logger.info("Provider dashboard accessed", { providerId });

    const data = await this._providerService.createProvider({}); 

    return sendResponse({
      res,
      message: "Dashboard fetched",
      data,
    });
  }
}
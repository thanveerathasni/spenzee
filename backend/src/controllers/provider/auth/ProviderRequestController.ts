import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../../di/types";
import { LOG_MESSAGES } from "../../../shared/constants/logMessages";
import { SUCCESS_MESSAGES } from "../../../shared/constants/successMessages";
import { logger } from "../../../shared/logger/logger";
import { sendResponse } from "../../../shared/utils/sendResponse";

import { IProviderRequestService } from "../../../types/services/provider/IProviderRequestService";


@injectable()
export class ProviderRequestController {
  constructor(
    @inject(TYPES.ProviderRequestService)
    private readonly _service: IProviderRequestService
  ) {}

  async getAllRequests(req: Request, res: Response) {
    logger.info(LOG_MESSAGES.PROVIDER.DASHBOARD_ACCESSED);

    const data = await this._service.getAllRequests();

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PROVIDER.REQUEST_FETCHED,
      data,
    });
  }

  async createRequest(req: Request, res: Response) {
    const data = await this._service.createRequest(req.body);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PROVIDER.REQUEST_CREATED,
      data,
    });
  }
}
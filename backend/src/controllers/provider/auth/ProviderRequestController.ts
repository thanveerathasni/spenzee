import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../../di/types";
import { logger } from "../../../shared/logger/logger";
import { sendResponse } from "../../../shared/utils/sendResponse";
import { IProviderRequestService } from "../../../types/services/provider/IProviderRequestService";

@injectable()
export class ProviderRequestController {
  constructor(
    @inject(TYPES.ProviderRequestService)
    private readonly _service: IProviderRequestService
  ) {}

  // ✅ FIXED METHOD
  async getAllRequests(req: Request, res: Response) {
    logger.info("Get all provider requests");

    const data = await this._service.getAllRequests();

    return sendResponse({
      res,
      message: "Requests fetched successfully",
      data,
    });
  }

  async createRequest(req: Request, res: Response) {
    const data = await this._service.createRequest(req.body);

    return sendResponse({
      res,
      message: "Request created",
      data,
    });
  }
}
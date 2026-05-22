import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import { SUCCESS_MESSAGES } from "../../../shared/constants/successMessages";
import { sendResponse } from "../../../shared/utils/sendResponse";
import { IProviderRequestService } from "../../../types/services/provider/IProviderRequestService";

@injectable()
export class ProviderRequestController {
  constructor(
    @inject(TYPES.ProviderRequestService)
    private readonly _providerRequestService: IProviderRequestService,
  ) {}

  async createRequest(req: Request, res: Response): Promise<Response> {
    const data = await this._providerRequestService.createRequest(req.body);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PROVIDER.REQUEST_CREATED,
      data,
    });
  }

  async getAllRequests(_req: Request, res: Response): Promise<Response> {
    const data = await this._providerRequestService.getAllRequests();

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PROVIDER.REQUEST_FETCHED,
      data,
    });
  }
}

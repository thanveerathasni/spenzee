import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";
import { ProviderDashboardService } from "../../services/provider/ProviderDashboardService";
import { ProviderService } from "../../services/provider/ProviderService";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages";
import { logger } from "../../shared/logger/logger";
import { sendResponse } from "../../shared/utils/sendResponse";

import { IProviderRequestService } from "../../types/services/provider/IProviderRequestService";

@injectable()
export class ProviderController {
  constructor(
    @inject(TYPES.ProviderDashboardService)
    private readonly _dashboardService: ProviderDashboardService,

    @inject(TYPES.ProviderService)
    private readonly _providerService: ProviderService,

    @inject(TYPES.ProviderRequestService)
    private readonly _requestService: IProviderRequestService
  ) {}

  async createRequest(req: Request, res: Response) {
    const result = await this._requestService.createRequest(req.body);

    return sendResponse({
      res,
      message: "Provider request submitted successfully",
      data: result,
    });
  }

  async getDashboard(req: Request, res: Response) {
    const providerId = req.user?.id;

    const data = await this._dashboardService.getDashboard(providerId!);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PROVIDER.DASHBOARD_FETCHED,
      data,
    });
  }
async getProfile(req: Request, res: Response) {
  const providerId = req.user?.id;

  const data = await this._providerService.getProfile(providerId!);

  return sendResponse({
    res,
    message: "Profile fetched",
    data,
  });
}
  async updateProfile(req: Request, res: Response) {
    const providerId = req.user?.id;

    const data = await this._providerService.updateProfile(
      providerId!,
      req.body
    );

    return sendResponse({
      res,
      message: "Profile updated successfully",
      data,
    });
  }

  async requestEmailChange(req: Request, res: Response) {
    const providerId = req.user?.id;

    await this._providerService.requestEmailChange(
      providerId!,
      req.body.email
    );

    return sendResponse({
      res,
      message: "OTP sent",
    });
  }

  async verifyEmailChange(req: Request, res: Response) {
    const providerId = req.user?.id;

    const data = await this._providerService.verifyEmailChange(
      providerId!,
      req.body.email,
      req.body.otp
    );

    return sendResponse({
      res,
      message: "Email updated",
      data,
    });
  }
}
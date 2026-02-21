import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ProviderDashboardService } from "../../services/provider/ProviderDashboardService";
import { ProviderRequest } from "../../types/ProviderRequest";

@injectable()
export class ProviderController {
  constructor(
    @inject(TYPES.ProviderDashboardService)
    private readonly dashboardService: ProviderDashboardService
  ) {}

  getDashboard = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const providerReq = req as ProviderRequest;
    const providerId = providerReq.provider.id;

    const data =
      await this.dashboardService.getDashboard(providerId);

    res.status(200).json({
      success: true,
      data,
    });
  };
}

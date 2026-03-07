import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IProviderService } from "../../types/services/provider/IProviderService";
import { UnauthorizedError } from "../../shared/errors/errors";

@injectable()
export class ProviderController {
  constructor(
    @inject(TYPES.ProviderService)
    private readonly providerService: IProviderService
  ) {}

  async getDashboard(req: Request, res: Response): Promise<Response> {
    if (!req.provider) {
      throw new UnauthorizedError("Provider not authenticated");
    }

    const providerId = req.provider.id;

    const data = await this.providerService.getDashboard(providerId);

    return res.status(200).json({
      success: true,
      data,
    });
  }
}
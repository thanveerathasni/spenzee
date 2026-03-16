import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { UnauthorizedError } from "../../shared/errors/errors";
import { IProviderService } from "../../types/services/provider/IProviderService";
import { AuthRequest } from "../../types/services/user/AuthRequest";

@injectable()
export class ProviderController {
  constructor(
    @inject(TYPES.ProviderService)
    private readonly _providerService: IProviderService,
  ) {}

  async getDashboard(req: AuthRequest, res: Response): Promise<Response> {
    if (!req.provider) {
      throw new UnauthorizedError("Provider not authenticated");
    }

    const data = await this._providerService.getDashboard(req.provider.id);

    return res.status(200).json({
      success: true,
      data,
    });
  }
}
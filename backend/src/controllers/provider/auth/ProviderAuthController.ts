import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../../di/types";
import { ProviderAuthService } from "../../../services/provider/auth/ProviderAuthService";
import { logger } from "../../../shared/logger/logger";
import { sendResponse } from "../../../shared/utils/sendResponse";

@injectable()
export class ProviderAuthController {
  constructor(
    @inject(TYPES.ProviderAuthService)
    private readonly _service: ProviderAuthService
  ) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    logger.info("Provider login", { email });

    const data = await this._service.login(email, password);

    return sendResponse({
      res,
      message: "Provider login success",
      data,
    });
  }

  async setupPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    logger.info("Provider setup password");

    await this._service.setupPassword(token, password);

    return sendResponse({
      res,
      message: "Password setup successful",
    });
  }
}
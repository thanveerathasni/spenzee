import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";
import { AdminAuthService } from "../../services/admin/AdminAuthService";
import { sendResponse } from "../../shared/utils/sendResponse";

@injectable()
export class AdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService)
    private readonly _service: AdminAuthService
  ) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const data = await this._service.login(email, password);

    return sendResponse({
      res,
      message: "Admin login success",
      data,
    });
  }
}
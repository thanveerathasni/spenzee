import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";
import { AdminService } from "../../services/admin/AdminService";
import { logger } from "../../shared/logger/logger";
import { sendResponse } from "../../shared/utils/sendResponse";

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.AdminService)
    private readonly _adminService: AdminService
  ) {}

  async getDashboard(req: Request, res: Response) {
    logger.info("Admin dashboard accessed");

    const data = await this._adminService.getDashboard();

    return sendResponse({
      res,
      message: "Admin dashboard",
      data,
    });
  }
}
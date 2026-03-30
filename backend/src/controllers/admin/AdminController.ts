import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages";
import { logger } from "../../shared/logger/logger";
import { sendResponse } from "../../shared/utils/sendResponse";
import { IAdminService } from "../../types/services/admin/IAdminService";



@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.AdminService)
    private readonly _adminService: IAdminService
  ) {}

  async getDashboard(req: Request, res: Response) {
    const adminId = req.user?.id; 

    logger.info(LOG_MESSAGES.ADMIN.DASHBOARD_ACCESSED, { adminId });

    const data = await this._adminService.getDashboard(adminId!); 

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.ADMIN.DASHBOARD_FETCHED,
      data,
    });
  }
}
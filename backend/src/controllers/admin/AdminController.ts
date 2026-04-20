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

  /* ================= DASHBOARD ================= */
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

  /* ================= USERS ================= */
  async getUsers(req: Request, res: Response) {
    const { page = 1, limit = 10, search = "" } = req.query;

    const data = await this._adminService.getUsers(
      Number(page),
      Number(limit),
      String(search)
    );

    return sendResponse({
      res,
      message: "Users fetched",
      data,
    });
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await this._adminService.getUserById(id);

    return sendResponse({
      res,
      message: "User fetched",
      data: user,
    });
  }

  async updateUserStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { isActive } = req.body;

    await this._adminService.updateUserStatus(id, isActive);

    return sendResponse({
      res,
      message: "User status updated",
    });
  }

  /* ================= PROVIDERS ================= */
  async getProviders(req: Request, res: Response) {
    const { status = "" } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || "");
    const data = await this._adminService.getProviders(
      String(status),
      Number(page),
      Number(limit),
      String(search)
    );

    return sendResponse({
      res,
      message: "Providers fetched",
      data,
    });
  }

  async updateProviderStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    await this._adminService.updateProviderStatus(id, status);

    return sendResponse({
      res,
      message: "Provider status updated",
    });
  }

  /* ================= PROVIDER REQUESTS ================= */
async getProviderRequests(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = String(req.query.search || "");

  const data = await this._adminService.getProviderRequests(
    page,
    limit,
    search
  );

  return sendResponse({
    res,
    message: "Provider requests fetched",
    data: {
      requests: data.requests,
      total: data.total,
    },
  });
}

  async reviewProviderRequest(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;
  const adminId = req.user?.id;

  const data = await this._adminService.reviewProviderRequest(
    id,
    adminId!,
    status
  );

  return sendResponse({
    res,
    message: "Request updated",
    data,
  });
}
}
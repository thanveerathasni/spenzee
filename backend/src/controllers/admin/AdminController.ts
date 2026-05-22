import {
  Request,
  Response,
} from "express";

import {
  inject,
  injectable,
} from "inversify";

import { TYPES } from "../../di/types";

import {
  ProviderStatus,
} from "../../models/Provider.model";

import {
  LOG_MESSAGES,
} from "../../shared/constants/logMessages";

import {
  SUCCESS_MESSAGES,
} from "../../shared/constants/successMessages";

import { logger } from "../../shared/logger/logger";

import { sendResponse } from "../../shared/utils/sendResponse";

import { IAdminService } from "../../types/services/admin/IAdminService";

@injectable()
export class AdminController {
  constructor(
    @inject(
      TYPES.AdminService,
    )
    private readonly _adminService: IAdminService,
  ) {}

  /* ====================================================== */
  /* DASHBOARD */
  /* ====================================================== */

  async getDashboard(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const adminId =
      req.user?.id;

    logger.info(
      LOG_MESSAGES.ADMIN
        .DASHBOARD_ACCESSED,
      {
        adminId,
      },
    );

    const data =
      await this._adminService.getDashboard(
        adminId!,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.ADMIN
          .DASHBOARD_FETCHED,

      data,
    });
  }

  /* ====================================================== */
  /* USERS */
  /* ====================================================== */

  async getUsers(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const page =
      Number(
        req.query.page,
      ) || 1;

    const limit =
      Number(
        req.query.limit,
      ) || 10;

    const search =
      String(
        req.query.search ||
          "",
      );

    const data =
      await this._adminService.getUsers(
        page,
        limit,
        search,
      );

    return sendResponse({
      res,

      message:
        "Users fetched successfully",

      data,
    });
  }

  async getUserById(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const user =
      await this._adminService.getUserById(
        req.params.id,
      );

    return sendResponse({
      res,

      message:
        "User fetched successfully",

      data: user,
    });
  }

  async updateUserStatus(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const { isActive } =
      req.body;

    await this._adminService.updateUserStatus(
      req.params.id,
      isActive,
    );

    return sendResponse({
      res,

      message:
        "User status updated successfully",
    });
  }

  /* ====================================================== */
  /* PROVIDERS */
  /* ====================================================== */

  async getProviders(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const status =
      String(
        req.query.status ||
          "",
      );

    const providerStatus =
      Object.values(
        ProviderStatus,
      ).includes(
        status as ProviderStatus,
      )
        ? (status as ProviderStatus)
        : "";

    const page =
      Number(
        req.query.page,
      ) || 1;

    const limit =
      Number(
        req.query.limit,
      ) || 10;

    const search =
      String(
        req.query.search ||
          "",
      );

    const data =
      await this._adminService.getProviders(
        providerStatus,
        page,
        limit,
        search,
      );

    return sendResponse({
      res,

      message:
        "Providers fetched successfully",

      data,
    });
  }

  async getProviderById(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._adminService.getProviderById(
        req.params.id,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .FETCHED,

      data,
    });
  }

  async updateProviderStatus(
    req: Request,
    res: Response,
  ): Promise<Response> {
    await this._adminService.updateProviderStatus(
      req.params.id,
      req.body.status,
    );

    return sendResponse({
      res,

      message:
        "Provider status updated successfully",
    });
  }

  /* ====================================================== */
  /* PROVIDER REQUESTS */
  /* ====================================================== */

  async getProviderRequests(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const page =
      Number(
        req.query.page,
      ) || 1;

    const limit =
      Number(
        req.query.limit,
      ) || 10;

    const search =
      String(
        req.query.search ||
          "",
      );

    const data =
      await this._adminService.getProviderRequests(
        page,
        limit,
        search,
      );

    return sendResponse({
      res,

      message:
        "Provider requests fetched successfully",

      data,
    });
  }

  async reviewProviderRequest(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const adminId =
      req.user?.id;

    const data =
      await this._adminService.reviewProviderRequest(
        req.params.id,
        adminId!,
        req.body.status,
      );

    return sendResponse({
      res,

      message:
        "Provider request reviewed successfully",

      data,
    });
  }
}
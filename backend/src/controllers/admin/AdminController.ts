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
  COMMERCE_STATUS,
  CommerceStatus,
} from "../../shared/constants/commerce";

import {
  ERROR_MESSAGES,
} from "../../shared/constants/errorMessages";

import {
  LOG_MESSAGES,
} from "../../shared/constants/logMessages";

import {
  SUCCESS_MESSAGES,
} from "../../shared/constants/successMessages";

import {
  UnauthorizedError,
} from "../../shared/errors/errors";

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

  async getCommerceProviders(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const status =
      String(
        req.query.status ||
          "",
      );

    const commerceStatus =
      Object.values(
        COMMERCE_STATUS,
      ).includes(
        status as CommerceStatus,
      )
        ? (status as CommerceStatus)
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
      await this._adminService.getCommerceProviders(
        commerceStatus,
        page,
        limit,
        search,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .COMMERCE_PROVIDERS_FETCHED,

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

  async approveProviderCommerce(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._adminService.approveProviderCommerce(
        req.params.id,
        this.getAdminId(req),
        req.body.commissionPercentage,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .COMMERCE_APPROVED,

      data,
    });
  }

  async rejectProviderCommerce(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._adminService.rejectProviderCommerce(
        req.params.id,
        this.getAdminId(req),
        req.body.reason,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .COMMERCE_REJECTED,

      data,
    });
  }

  async freezeProviderCommerce(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._adminService.freezeProviderCommerce(
        req.params.id,
        this.getAdminId(req),
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .COMMERCE_FROZEN,

      data,
    });
  }

  async resumeProviderCommerce(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._adminService.resumeProviderCommerce(
        req.params.id,
        this.getAdminId(req),
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .COMMERCE_RESUMED,

      data,
    });
  }

  async updateProviderCommission(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._adminService.updateProviderCommission(
        req.params.id,
        this.getAdminId(req),
        req.body.commissionPercentage,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .COMMISSION_UPDATED,

      data,
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

  private getAdminId(
    req: Request,
  ): string {
    const adminId =
      req.user?.id;

    if (!adminId) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .ACCESS_DENIED,
      );
    }

    return adminId;
  }
}

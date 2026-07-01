import {
  Request,
  Response,
} from "express";

import {
  injectable,
  inject,
} from "inversify";

import { TYPES } from "../../di/types";

import { ProviderDashboardService } from "../../services/provider/ProviderDashboardService";

import { ProviderService } from "../../services/provider/ProviderService";

import {
  ERROR_MESSAGES,
} from "../../shared/constants/errorMessages";

import {
  SUCCESS_MESSAGES,
} from "../../shared/constants/successMessages";

import {
  UnauthorizedError,
} from "../../shared/errors/errors";

import { sendResponse } from "../../shared/utils/sendResponse";

import { IProviderRequestService } from "../../types/services/provider/IProviderRequestService";

@injectable()
export class ProviderController {
  constructor(
    @inject(
      TYPES.ProviderDashboardService,
    )
    private readonly _dashboardService: ProviderDashboardService,

    @inject(
      TYPES.ProviderService,
    )
    private readonly _providerService: ProviderService,

    @inject(
      TYPES.ProviderRequestService,
    )
    private readonly _requestService: IProviderRequestService,
  ) {}

  /* ====================================================== */
  /* REQUESTS */
  /* ====================================================== */

  async createRequest(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._requestService.createRequest(
        req.body,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .REQUEST_CREATED,

      data,
    });
  }

  /* ====================================================== */
  /* DASHBOARD */
  /* ====================================================== */

  async getDashboard(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const providerId =
      this.getProviderId(req);

    const data =
      await this._dashboardService.getDashboard(
        providerId,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .DASHBOARD_FETCHED,

      data,
    });
  }

  async getCommerceStatus(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const providerId =
      this.getProviderId(req);

    const data =
      await this._providerService.getCommerceStatus(
        providerId,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .COMMERCE_STATUS_FETCHED,

      data,
    });
  }

  /* ====================================================== */
  /* PROFILE */
  /* ====================================================== */

  async getProfile(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const providerId =
      this.getProviderId(req);

    const data =
      await this._providerService.getProfile(
        providerId,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .PROFILE_FETCHED,

      data,
    });
  }

  async updateProfile(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const providerId =
      this.getProviderId(req);

    const data =
      await this._providerService.updateProfile(
        providerId,
        req.body,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .PROFILE_UPDATED,

      data,
    });
  }

  /* ====================================================== */
  /* PROFILE IMAGE */
  /* ====================================================== */

  async uploadProfileImage(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const providerId =
      this.getProviderId(req);

    if (!req.file) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.USER
          .IMAGE_FILE_REQUIRED,
      );
    }

    const data =
      await this._providerService.updateProfileImage(
        providerId,
        req.file,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.USER
          .PROFILE_UPDATED,

      data,
    });
  }

  async removeProfileImage(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const providerId =
      this.getProviderId(req);

    const data =
      await this._providerService.removeProfileImage(
        providerId,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.USER
          .PROFILE_IMAGE_REMOVED,

      data,
    });
  }

  /* ====================================================== */
  /* EMAIL */
  /* ====================================================== */

  async requestEmailChange(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const providerId =
      this.getProviderId(req);

    await this._providerService.requestEmailChange(
      providerId,
      req.body.email,
    );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .EMAIL_OTP_SENT,
    });
  }

  async verifyEmailChange(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const providerId =
      this.getProviderId(req);

    const data =
      await this._providerService.verifyEmailChange(
        providerId,
        req.body.email,
        req.body.otp,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .EMAIL_UPDATED,

      data,
    });
  }

  /* ====================================================== */
  /* TERMS */
  /* ====================================================== */

  async acceptTerms(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const providerId =
      this.getProviderId(req);

    const data =
      await this._providerService.acceptTerms(
        providerId,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES.PROVIDER
          .TERMS_ACCEPTED,

      data,
    });
  }

  /* ====================================================== */
  /* HELPERS */
  /* ====================================================== */

  private getProviderId(
    req: Request,
  ): string {
    const providerId =
      req.user?.id;

    if (!providerId) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .ACCESS_DENIED,
      );
    }

    return providerId;
  }
}

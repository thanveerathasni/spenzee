import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../di/types";

import {
  PROVIDER_SUCCESS_MESSAGES,
  PROVIDER_ERROR_MESSAGES,
} from "../../../shared/constants/provider";
import { ProviderRequestStatus } from "../../../shared/constants/providerRequestStatus";


import { IProviderRequestService } from "../../../types/services/provider/IProviderRequestService";
import { AuthRequest } from "../../../types/services/user/AuthRequest";

@injectable()
export class ProviderRequestController {
  constructor(
    @inject(TYPES.ProviderRequestService)
    private readonly _providerRequestService: IProviderRequestService,
  ) {}

  async createProviderRequest(req: Request, res: Response): Promise<void> {
    const { brandName, websiteUrl, primaryCategory, contactEmail, description } = req.body;

    const request = await this._providerRequestService.createRequest({
      brandName,
      websiteUrl,
      primaryCategory,
      contactEmail,
      description,
    });

    res.status(201).json({
      message: PROVIDER_SUCCESS_MESSAGES.REQUEST_SUBMITTED,
      data: request,
    });
  }

  async getAllProviderRequests(_req: Request, res: Response): Promise<void> {
    const requests = await this._providerRequestService.getAllRequests();

    res.status(200).json({
      data: requests,
    });
  }

  async getProviderRequestsByStatus(req: Request, res: Response): Promise<void> {
    const { status } = req.params;

    if (!Object.values(ProviderRequestStatus).includes(status as ProviderRequestStatus)) {
      res.status(400).json({
        message: PROVIDER_ERROR_MESSAGES.INVALID_STATUS,
      });
      return;
    }

    const requests = await this._providerRequestService.getRequestsByStatus(
      status as ProviderRequestStatus,
    );

    res.status(200).json({
      data: requests,
    });
  }

  async reviewProviderRequest(req: AuthRequest, res: Response): Promise<void> {
    const { requestId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!req.admin) {
      res.status(401).json({ message: "Admin not authenticated" });
      return;
    }

    const updated = await this._providerRequestService.reviewRequest(
      requestId,
      req.admin.id,
      status,
      rejectionReason,
    );

    res.status(200).json({
      message: PROVIDER_SUCCESS_MESSAGES.REQUEST_UPDATED,
      data: updated,
    });
  }
}
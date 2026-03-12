import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../di/types";
import { IProviderRequestService } from "../../../types/services/provider/IProviderRequestService";
import { ProviderRequestStatus } from "../../../models/ProviderRequest.model";
import {
  PROVIDER_SUCCESS_MESSAGES,
  PROVIDER_ERROR_MESSAGES,
} from "../../../shared/constants/provider";

@injectable()
export class ProviderRequestController {
  constructor(
    @inject(TYPES.ProviderRequestService)
    private readonly providerRequestService: IProviderRequestService,
  ) {}

  async createProviderRequest(req: Request, res: Response): Promise<void> {
    const { brandName, websiteUrl, primaryCategory, contactEmail, description } = req.body;

    const request = await this.providerRequestService.createRequest({
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
    const requests = await this.providerRequestService.getAllRequests();

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

    const requests = await this.providerRequestService.getRequestsByStatus(
      status as ProviderRequestStatus,
    );

    res.status(200).json({
      data: requests,
    });
  }

  async reviewProviderRequest(req: Request, res: Response): Promise<void> {
    const { requestId } = req.params;
    const { status, rejectionReason } = req.body;

    const adminId = req.admin!.id;

    if (!Object.values(ProviderRequestStatus).includes(status as ProviderRequestStatus)) {
      res.status(400).json({
        message: PROVIDER_ERROR_MESSAGES.INVALID_STATUS,
      });
      return;
    }

    const updatedRequest = await this.providerRequestService.reviewRequest(
      requestId,
      adminId,
      status,
      rejectionReason,
    );

    res.status(200).json({
      message: PROVIDER_SUCCESS_MESSAGES.REQUEST_UPDATED,
      data: updatedRequest,
    });
  }
}

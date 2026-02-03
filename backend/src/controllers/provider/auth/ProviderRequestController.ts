import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../../di/types';
import { IProviderRequestService } from '../../../types/services/provider/IProviderRequestService';
import { ProviderRequestStatus } from '../../../models/ProviderRequest.model';

@injectable()
export class ProviderRequestController {
  constructor(
    @inject(TYPES.ProviderRequestService)
    private readonly providerRequestService: IProviderRequestService
  ) {}

  // Provider submits request (PUBLIC)
  async createProviderRequest(req: Request, res: Response): Promise<void> {
    const {
      brandName,
      websiteUrl,
      primaryCategory,
      contactEmail,
      description,
    } = req.body;

    const request =
      await this.providerRequestService.createRequest({
        brandName,
        websiteUrl,
        primaryCategory,
        contactEmail,
        description,
      });

    res.status(201).json({
      message: 'Provider request submitted successfully',
      data: request,
    });
  }

  // Admin: get all provider requests
  async getAllProviderRequests(
    req: Request,
    res: Response
  ): Promise<void> {
    const requests =
      await this.providerRequestService.getAllRequests();

    res.status(200).json({
      data: requests,
    });
  }

  // Admin: get provider requests by status
  async getProviderRequestsByStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    const { status } = req.params;

    if (!Object.values(ProviderRequestStatus).includes(status as ProviderRequestStatus)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const requests =
      await this.providerRequestService.getRequestsByStatus(
        status as ProviderRequestStatus
      );

    res.status(200).json({
      data: requests,
    });
  }

  // Admin: approve / reject provider request
  async reviewProviderRequest(
    req: Request,
    res: Response
  ): Promise<void> {
    const { requestId } = req.params;
    const { status, rejectionReason } = req.body;

    const adminId = (req as any).admin.id; // comes from authenticateAdmin middleware

    if (
      !Object.values(ProviderRequestStatus).includes(status)
    ) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const updatedRequest =
      await this.providerRequestService.reviewRequest(
        requestId,
        adminId,
        status,
        rejectionReason
      );

    res.status(200).json({
      message: 'Provider request updated successfully',
      data: updatedRequest,
    });
  }
}

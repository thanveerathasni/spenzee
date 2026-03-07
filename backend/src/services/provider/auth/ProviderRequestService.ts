import { inject, injectable } from "inversify";
import crypto from "crypto";
import { Types } from "mongoose";

import {
  IProviderRequest,
  ProviderRequestStatus,
} from "../../../models/ProviderRequest.model";

import { IProviderRequestRepository } from "../../../types/repositories/provider/IProviderRequestRepository";
import { IProviderRequestService } from "../../../types/services/provider/IProviderRequestService";
import { IProviderService } from "../../../types/services/provider/IProviderService";
import { IProviderPasswordSetupTokenRepository } from "../../../types/repositories/provider/IProviderPasswordSetupTokenRepository";

import { TYPES } from "../../../di/types";
import {
  PROVIDER_PASSWORD_SETUP,
  PROVIDER_ERROR_MESSAGES,
} from "../../../shared/constants/provider";

import { AppError } from "../../../shared/errors/AppError";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";

@injectable()
export class ProviderRequestService
  implements IProviderRequestService
{
  constructor(
    @inject(TYPES.ProviderRequestRepository)
    private readonly providerRequestRepository: IProviderRequestRepository,

    @inject(TYPES.ProviderService)
    private readonly providerService: IProviderService,

    @inject(TYPES.ProviderPasswordSetupTokenRepository)
    private readonly passwordSetupTokenRepository: IProviderPasswordSetupTokenRepository
  ) {}

  async createRequest(
    data: {
      brandName: string;
      websiteUrl: string;
      primaryCategory: string;
      contactEmail: string;
      description: string;
    }
  ): Promise<IProviderRequest> {
    return this.providerRequestRepository.create(data);
  }

  async getAllRequests(): Promise<IProviderRequest[]> {
    return this.providerRequestRepository.findAll();
  }

  async getRequestsByStatus(
    status: ProviderRequestStatus
  ): Promise<IProviderRequest[]> {
    return this.providerRequestRepository.findByStatus(status);
  }

  async reviewRequest(
    requestId: string,
    adminId: string,
    status: ProviderRequestStatus,
    rejectionReason?: string
  ): Promise<IProviderRequest> {
    const request =
      await this.providerRequestRepository.findById(requestId);

    if (!request) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.REQUEST_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (request.status !== ProviderRequestStatus.PENDING) {
      throw new AppError(
        PROVIDER_ERROR_MESSAGES.ALREADY_REVIEWED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (status === ProviderRequestStatus.REJECTED) {
      const rejectedRequest =
        await this.providerRequestRepository.updateStatus(
          requestId,
          status,
          adminId,
          rejectionReason
        );

      if (!rejectedRequest) {
        throw new AppError(
          PROVIDER_ERROR_MESSAGES.REJECTION_FAILED,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return rejectedRequest;
    }

    if (status === ProviderRequestStatus.APPROVED) {
      const provider =
        await this.providerService.createProvider({
          brandName: request.brandName,
          email: request.contactEmail,
          primaryCategory: request.primaryCategory,
          websiteUrl: request.websiteUrl,
          description: request.description,
        });

      const rawToken = crypto.randomBytes(32).toString("hex");

      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      const expiresAt = new Date(
        Date.now() + PROVIDER_PASSWORD_SETUP.TOKEN_EXPIRATION_MS
      );

      await this.passwordSetupTokenRepository.create({
        providerId: provider._id as Types.ObjectId,
        hashedToken,
        expiresAt,
      });

      const setupUrl =
        `${process.env.CLIENT_URL}/provider/setup-password?token=${rawToken}`;

      // temporary log until email service added
      console.info("Provider password setup link:", setupUrl);

      const approvedRequest =
        await this.providerRequestRepository.updateStatus(
          requestId,
          status,
          adminId
        );

      if (!approvedRequest) {
        throw new AppError(
          PROVIDER_ERROR_MESSAGES.APPROVAL_FAILED,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return approvedRequest;
    }

    throw new AppError(
      PROVIDER_ERROR_MESSAGES.INVALID_STATUS,
      HTTP_STATUS.BAD_REQUEST
    );
  }
}
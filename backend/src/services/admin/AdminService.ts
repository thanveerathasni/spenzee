import crypto from "crypto";

import {
  inject,
  injectable,
} from "inversify";

import {
  Types,
} from "mongoose";

import { TYPES } from "../../di/types";

import {
  IProvider,
  ProviderStatus,
} from "../../models/Provider.model";

import {
  COMMERCE_STATUS,
  DEFAULT_COMMISSION_PERCENTAGE,
  CommerceStatus,
} from "../../shared/constants/commerce";

import {
  ERROR_MESSAGES,
} from "../../shared/constants/errorMessages";

import {
  LOG_MESSAGES,
} from "../../shared/constants/logMessages";

import {
  NOTIFICATION_CONTENT,
  NOTIFICATION_TYPES,
} from "../../shared/constants/notification";

import {
  ProviderRequestStatus,
} from "../../shared/constants/providerRequestStatus";

import { ROLES } from "../../shared/constants/roles";

import {
  VERIFICATION_STATUS,
} from "../../shared/constants/verification";

import { AdminDashboardDTO } from "../../shared/dto/admin/adminDashboard.dto";

import { ProviderDTO } from "../../shared/dto/provider/provider.dto";

import {
  BadRequestError,
} from "../../shared/errors/errors";

import { logger } from "../../shared/logger/logger";

import { ProviderMapper } from "../../shared/mapper/provider/ProviderMapper";

import { IAdminRepository } from "../../types/repositories/admin/IAdminRepository";

import { IProviderPasswordSetupTokenRepository } from "../../types/repositories/provider/IProviderPasswordSetupTokenRepository";

import { IProviderRepository } from "../../types/repositories/provider/IProviderRepository";

import { IProviderRequestRepository } from "../../types/repositories/provider/IProviderRequestRepository";

import { IUserRepository } from "../../types/repositories/user/IUserRepository";

import {
  IProviderVerificationRepository,
} from "../../types/repositories/verification/IProviderVerificationRepository";

import { IMailService } from "../../types/services/IMailService";

import { NotificationService } from "../notification/NotificationService";

const PROVIDER_SETUP_TOKEN_EXPIRY_MS =
  24 * 60 * 60 * 1000;

@injectable()
export class AdminService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly _repo: IAdminRepository,

    @inject(TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,

    @inject(TYPES.ProviderRepository)
    private readonly _providerRepo: IProviderRepository,

    @inject(
      TYPES.ProviderPasswordSetupTokenRepository,
    )
    private readonly _setupTokenRepo: IProviderPasswordSetupTokenRepository,

    @inject(
      TYPES.ProviderRequestRepository,
    )
    private readonly _providerRequestRepository: IProviderRequestRepository,

    @inject(
      TYPES.ProviderVerificationRepository,
    )
    private readonly _providerVerificationRepository: IProviderVerificationRepository,

    @inject(TYPES.NotificationService)
    private readonly _notificationService: NotificationService,

    @inject(TYPES.MailService)
    private readonly _mailService: IMailService,
  ) {}

  /* ====================================================== */
  /* DASHBOARD */
  /* ====================================================== */

  async getDashboard(
    adminId: string,
  ): Promise<AdminDashboardDTO> {
    logger.info(
      LOG_MESSAGES.ADMIN
        .DASHBOARD_ACCESSED,
      {
        adminId,
      },
    );

    return {
      totalUsers: 0,

      totalProviders: 0,

      totalTransactions: 0,

      revenue: 0,
    };
  }

  /* ====================================================== */
  /* USERS */
  /* ====================================================== */

  async getUsers(
    page: number,
    limit: number,
    search: string,
  ) {
    return this._userRepo.findAllPaginated(
      page,
      limit,
      search,
    );
  }

  async getUserById(
    userId: string,
  ) {
    return this._userRepo.findById(
      userId,
    );
  }

  async updateUserStatus(
    userId: string,
    isActive: boolean,
  ): Promise<void> {
    await this._userRepo.updateById(
      userId,
      {
        isActive,
      },
    );

    logger.info(
      LOG_MESSAGES.ADMIN
        .DASHBOARD_ACCESSED,
      {
        userId,
        isActive,
      },
    );
  }

  /* ====================================================== */
  /* PROVIDERS */
  /* ====================================================== */

  async getProviders(
    status: ProviderStatus | "",
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    providers: IProvider[];

    total: number;
  }> {
    return this._providerRepo.findAllPaginated(
      status,
      page,
      limit,
      search,
    );
  }

  async getCommerceProviders(
    commerceStatus: CommerceStatus | "",
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    providers: IProvider[];

    total: number;
  }> {
    return this._providerRepo.findCommercePaginated(
      commerceStatus,
      page,
      limit,
      search,
    );
  }

  async getProviderById(
    providerId: string,
  ): Promise<ProviderDTO> {
    const provider =
      await this._providerRepo.findById(
        providerId,
      );

    if (!provider) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    return ProviderMapper.toDTO(
      provider,
    );
  }

  async updateProviderStatus(
    providerId: string,
    status: ProviderStatus,
  ): Promise<void> {
    await this._providerRepo.updateStatus(
      providerId,
      status,
    );

    logger.info(
      LOG_MESSAGES.PROVIDER
        .REQUEST_REVIEWED,
      {
        providerId,
        status,
      },
    );
  }

  async approveProviderCommerce(
    providerId: string,
    adminId: string,
    commissionPercentage: number =
      DEFAULT_COMMISSION_PERCENTAGE,
  ): Promise<ProviderDTO> {
    this.assertCommission(
      commissionPercentage,
    );

    const provider =
      await this.getProviderOrThrow(
        providerId,
      );

    if (
      provider.commerceStatus ===
        COMMERCE_STATUS.APPROVED &&
      provider.commerceEnabled &&
      !provider.isCommerceFrozen
    ) {
      throw new BadRequestError(
        ERROR_MESSAGES.PROVIDER_COMMERCE
          .ALREADY_APPROVED,
      );
    }

    this.assertProviderCanBecomeSeller(
      provider,
    );

    await this.assertProviderVerified(
      providerId,
    );

    const updated =
      await this._providerRepo.updateById(
        providerId,
        {
          commerceStatus:
            COMMERCE_STATUS.APPROVED,
          commerceEnabled: true,
          commerceEnabledAt:
            new Date(),
          commerceApprovedBy:
            new Types.ObjectId(
              adminId,
            ),
          commerceRejectedReason:
            undefined,
          commissionPercentage,
          isCommerceFrozen: false,
        },
      );

    if (!updated) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    await this.notifyProvider(
      providerId,
      NOTIFICATION_CONTENT
        .PROVIDER_COMMERCE_APPROVED
        .TITLE,
      NOTIFICATION_CONTENT
        .PROVIDER_COMMERCE_APPROVED
        .MESSAGE,
      NOTIFICATION_TYPES
        .PROVIDER_COMMERCE_APPROVED,
    );

    logger.info(
      LOG_MESSAGES.PROVIDER
        .COMMERCE_APPROVED,
      {
        providerId,
        adminId,
        commissionPercentage,
        timestamp: new Date(),
        action: "APPROVE_COMMERCE",
      },
    );

    return ProviderMapper.toDTO(
      updated,
    );
  }

  async rejectProviderCommerce(
    providerId: string,
    adminId: string,
    reason: string,
  ): Promise<ProviderDTO> {
    if (!reason.trim()) {
      throw new BadRequestError(
        ERROR_MESSAGES.PROVIDER_COMMERCE
          .REJECTION_REASON_REQUIRED,
      );
    }

    const provider =
      await this.getProviderOrThrow(
        providerId,
      );

    if (
      provider.commerceStatus ===
      COMMERCE_STATUS.REJECTED
    ) {
      throw new BadRequestError(
        ERROR_MESSAGES.PROVIDER_COMMERCE
          .ALREADY_REJECTED,
      );
    }

    const updated =
      await this._providerRepo.updateById(
        providerId,
        {
          commerceStatus:
            COMMERCE_STATUS.REJECTED,
          commerceEnabled: false,
          commerceApprovedBy:
            new Types.ObjectId(
              adminId,
            ),
          commerceRejectedReason:
            reason.trim(),
          isCommerceFrozen: false,
        },
      );

    if (!updated) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    await this.notifyProvider(
      providerId,
      NOTIFICATION_CONTENT
        .PROVIDER_COMMERCE_REJECTED
        .TITLE,
      reason.trim(),
      NOTIFICATION_TYPES
        .PROVIDER_COMMERCE_REJECTED,
    );

    logger.info(
      LOG_MESSAGES.PROVIDER
        .COMMERCE_REJECTED,
      {
        providerId,
        adminId,
        timestamp: new Date(),
        action: "REJECT_COMMERCE",
      },
    );

    return ProviderMapper.toDTO(
      updated,
    );
  }

  async freezeProviderCommerce(
    providerId: string,
    adminId: string,
  ): Promise<ProviderDTO> {
    const provider =
      await this.getProviderOrThrow(
        providerId,
      );

    if (
      provider.isCommerceFrozen ||
      provider.commerceStatus ===
        COMMERCE_STATUS.FROZEN
    ) {
      throw new BadRequestError(
        ERROR_MESSAGES.PROVIDER_COMMERCE
          .ALREADY_FROZEN,
      );
    }

    if (
      provider.commerceStatus !==
      COMMERCE_STATUS.APPROVED
    ) {
      throw new BadRequestError(
        ERROR_MESSAGES.PROVIDER_COMMERCE
          .DISABLED,
      );
    }

    const updated =
      await this._providerRepo.updateById(
        providerId,
        {
          commerceStatus:
            COMMERCE_STATUS.FROZEN,
          commerceEnabled: false,
          commerceApprovedBy:
            new Types.ObjectId(
              adminId,
            ),
          isCommerceFrozen: true,
        },
      );

    if (!updated) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    await this.notifyProvider(
      providerId,
      NOTIFICATION_CONTENT
        .PROVIDER_COMMERCE_FROZEN
        .TITLE,
      NOTIFICATION_CONTENT
        .PROVIDER_COMMERCE_FROZEN
        .MESSAGE,
      NOTIFICATION_TYPES
        .PROVIDER_COMMERCE_FROZEN,
    );

    logger.info(
      LOG_MESSAGES.PROVIDER
        .COMMERCE_FROZEN,
      {
        providerId,
        adminId,
        timestamp: new Date(),
        action: "FREEZE_COMMERCE",
      },
    );

    return ProviderMapper.toDTO(
      updated,
    );
  }

  async resumeProviderCommerce(
    providerId: string,
    adminId: string,
  ): Promise<ProviderDTO> {
    const provider =
      await this.getProviderOrThrow(
        providerId,
      );

    if (
      !provider.isCommerceFrozen &&
      provider.commerceStatus !==
        COMMERCE_STATUS.FROZEN
    ) {
      throw new BadRequestError(
        ERROR_MESSAGES.PROVIDER_COMMERCE
          .NOT_FROZEN,
      );
    }

    const updated =
      await this._providerRepo.updateById(
        providerId,
        {
          commerceStatus:
            COMMERCE_STATUS.APPROVED,
          commerceEnabled: true,
          commerceApprovedBy:
            new Types.ObjectId(
              adminId,
            ),
          isCommerceFrozen: false,
        },
      );

    if (!updated) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    await this.notifyProvider(
      providerId,
      NOTIFICATION_CONTENT
        .PROVIDER_COMMERCE_RESUMED
        .TITLE,
      NOTIFICATION_CONTENT
        .PROVIDER_COMMERCE_RESUMED
        .MESSAGE,
      NOTIFICATION_TYPES
        .PROVIDER_COMMERCE_RESUMED,
    );

    logger.info(
      LOG_MESSAGES.PROVIDER
        .COMMERCE_RESUMED,
      {
        providerId,
        adminId,
        timestamp: new Date(),
        action: "RESUME_COMMERCE",
      },
    );

    return ProviderMapper.toDTO(
      updated,
    );
  }

  async updateProviderCommission(
    providerId: string,
    adminId: string,
    commissionPercentage: number,
  ): Promise<ProviderDTO> {
    this.assertCommission(
      commissionPercentage,
    );

    await this.getProviderOrThrow(
      providerId,
    );

    const updated =
      await this._providerRepo.updateById(
        providerId,
        {
          commissionPercentage,
        },
      );

    if (!updated) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    await this.notifyProvider(
      providerId,
      NOTIFICATION_CONTENT
        .PROVIDER_COMMISSION_UPDATED
        .TITLE,
      NOTIFICATION_CONTENT
        .PROVIDER_COMMISSION_UPDATED
        .MESSAGE,
      NOTIFICATION_TYPES
        .PROVIDER_COMMISSION_UPDATED,
    );

    logger.info(
      LOG_MESSAGES.PROVIDER
        .COMMISSION_UPDATED,
      {
        providerId,
        adminId,
        commissionPercentage,
        timestamp: new Date(),
        action: "UPDATE_COMMISSION",
      },
    );

    return ProviderMapper.toDTO(
      updated,
    );
  }

  /* ====================================================== */
  /* PROVIDER REQUESTS */
  /* ====================================================== */

  async getProviderRequests(
    page: number,
    limit: number,
    search: string,
  ) {
    return this._providerRequestRepository.findAllPaginated(
      page,
      limit,
      search,
    );
  }

  async reviewProviderRequest(
    requestId: string,
    adminId: string,
    status: ProviderRequestStatus,
  ) {
    const request =
      await this._providerRequestRepository.updateStatus(
        requestId,
        status,
        adminId,
      );

    if (!request) {
      throw new BadRequestError(
        "Provider request not found",
      );
    }

    logger.info(
      LOG_MESSAGES.PROVIDER
        .REQUEST_REVIEWED,
      {
        requestId,
        adminId,
        status,
      },
    );

    if (
      status ===
      ProviderRequestStatus.APPROVED
    ) {
      const provider =
        await this._providerRepo.create(
          {
            brandName:
              request.brandName,

            email:
              request.contactEmail,

            primaryCategory:
              request.primaryCategory,

            websiteUrl:
              request.websiteUrl,

            description:
              request.description,

            status:
              ProviderStatus.ACTIVE,
          },
        );

      const rawToken =
        crypto
          .randomBytes(32)
          .toString("hex");

      const hashedToken =
        crypto
          .createHash("sha256")
          .update(rawToken)
          .digest("hex");

      await this._setupTokenRepo.create(
        {
          providerId:
            provider._id,

          hashedToken,

          expiresAt:
            new Date(
              Date.now() +
                PROVIDER_SETUP_TOKEN_EXPIRY_MS,
            ),
        },
      );

      const setupLink =
        `${
          process.env
            .CLIENT_URL ||
          "http://localhost:5173"
        }/provider/setup-password?token=${rawToken}`;

      await this._mailService.sendGenericEmail(
        provider.email,
        "Provider Approved",
        `Your provider account has been approved.\n\nSetup your password using this link:\n\n${setupLink}`,
      );

      logger.info(
        LOG_MESSAGES.PROVIDER
          .REQUEST_REVIEWED,
        {
          providerId:
            provider._id.toString(),

          approved: true,
        },
      );
    }

    return request;
  }

  private async getProviderOrThrow(
    providerId: string,
  ): Promise<IProvider> {
    const provider =
      await this._providerRepo.findById(
        providerId,
      );

    if (!provider) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    return provider;
  }

  private assertProviderCanBecomeSeller(
    provider: IProvider,
  ): void {
    if (
      provider.status !==
      ProviderStatus.ACTIVE
    ) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .ACCOUNT_BLOCKED,
      );
    }
  }

  private async assertProviderVerified(
    providerId: string,
  ): Promise<void> {
    const latestVerification =
      await this._providerVerificationRepository.findLatestByProviderId(
        providerId,
      );

    if (
      latestVerification
        ?.verificationStatus !==
      VERIFICATION_STATUS.APPROVED
    ) {
      throw new BadRequestError(
        ERROR_MESSAGES.PROVIDER_COMMERCE
          .PROVIDER_NOT_VERIFIED,
      );
    }
  }

  private assertCommission(
    commissionPercentage: number,
  ): void {
    if (
      commissionPercentage < 0 ||
      commissionPercentage > 100
    ) {
      throw new BadRequestError(
        ERROR_MESSAGES.PROVIDER_COMMERCE
          .INVALID_COMMISSION,
      );
    }
  }

  private async notifyProvider(
    providerId: string,
    title: string,
    message: string,
    notificationType: typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES],
  ): Promise<void> {
    await this._notificationService.create(
      {
        recipientId: providerId,
        recipientRole:
          ROLES.PROVIDER,
        title,
        message,
        notificationType,
      },
    );
  }
}

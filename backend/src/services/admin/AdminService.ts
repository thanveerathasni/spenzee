import crypto from "crypto";

import {
  inject,
  injectable,
} from "inversify";

import { TYPES } from "../../di/types";

import {
  IProvider,
  ProviderStatus,
} from "../../models/Provider.model";

import {
  ERROR_MESSAGES,
} from "../../shared/constants/errorMessages";

import {
  LOG_MESSAGES,
} from "../../shared/constants/logMessages";

import {
  ProviderRequestStatus,
} from "../../shared/constants/providerRequestStatus";

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

import { IMailService } from "../../types/services/IMailService";

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
}
import crypto from "crypto";
import { inject, injectable } from "inversify";

import { TYPES } from "../../di/types";
import { ProviderStatus } from "../../models/Provider.model";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { ProviderRequestStatus } from "../../shared/constants/providerRequestStatus";
import { AdminDashboardDTO } from "../../shared/dto/admin/adminDashboard.dto";
import { logger } from "../../shared/logger/logger";

import { IAdminRepository } from "../../types/repositories/admin/IAdminRepository";
import { IProviderPasswordSetupTokenRepository } from "../../types/repositories/provider/IProviderPasswordSetupTokenRepository";
import { IProviderRepository } from "../../types/repositories/provider/IProviderRepository";
import { IProviderRequestRepository } from "../../types/repositories/provider/IProviderRequestRepository";
import { IUserRepository } from "../../types/repositories/user/IUserRepository";
import { IMailService } from "../../types/services/IMailService";

import { IProvider } from "../../models/Provider.model";

@injectable()
export class AdminService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly _repo: IAdminRepository,

    @inject(TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,

    @inject(TYPES.ProviderRepository)
    private readonly _providerRepo: IProviderRepository,

    @inject(TYPES.ProviderPasswordSetupTokenRepository)
    private readonly _setupTokenRepo: IProviderPasswordSetupTokenRepository,

    @inject(TYPES.ProviderRequestRepository)
    private readonly _providerRequestRepository: IProviderRequestRepository,

    @inject(TYPES.MailService)
    private readonly _mailService: IMailService
  ) {}

  /* ================= DASHBOARD ================= */

  async getDashboard(adminId: string): Promise<AdminDashboardDTO> {
    logger.info(LOG_MESSAGES.ADMIN.DASHBOARD_ACCESSED, { adminId });

    return {
      totalUsers: 0,
      totalProviders: 0,
      totalTransactions: 0,
      revenue: 0,
    };
  }

  /* ================= USERS ================= */

  async getUsers(page: number, limit: number, search: string) {
    return this._userRepo.findAllPaginated(page, limit, search);
  }

  async getUserById(userId: string) {
    return this._userRepo.findById(userId);
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    await this._userRepo.updateById(userId, { isActive });
  }

  /* ================= PROVIDERS ================= */

  async getProviders(
    status: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ providers: IProvider[]; total: number }> {
    const query: any = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { brandName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await (this._providerRepo as any).model.countDocuments(query);

    const providers = await (this._providerRepo as any).model
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return { providers, total };
  }

  async updateProviderStatus(providerId: string, status: string): Promise<void> {
    await this._providerRepo.updateStatus(providerId, status);

    if (status === "active") {
      const provider = await this._providerRepo.findById(providerId);
      if (!provider) return;

      const rawToken = crypto.randomBytes(32).toString("hex");

      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      await this._setupTokenRepo.create({
        providerId: provider._id,
        hashedToken,
        expiresAt: new Date(Date.now() + 86400000),
        isUsed: false,
      });

      const setupLink = `http://localhost:5173/provider/setup-password?token=${rawToken}`;

      await this._mailService.sendGenericEmail(
        provider.email,
        "Provider Approved",
        `Setup your password: ${setupLink}`
      );
    }
  }

  /* ================= PROVIDER REQUEST ================= */

  async getProviderRequests(page: number, limit: number, search: string) {
    const { requests, total } =
      await this._providerRequestRepository.findAllPaginated(
        page,
        limit,
        search
      );

    return { requests, total };
  }

  async reviewProviderRequest(
    requestId: string,
    adminId: string,
    status: ProviderRequestStatus
  ) {
    const request = await this._providerRequestRepository.updateStatus(
      requestId,
      status,
      adminId
    );

    if (!request) throw new Error("Provider request not found");

    if (status === ProviderRequestStatus.APPROVED) {
      const provider = await this._providerRepo.create({
        brandName: request.brandName,
        email: request.contactEmail,
        primaryCategory: request.primaryCategory,
        websiteUrl: request.websiteUrl,
        description: request.description,
        status: ProviderStatus.ACTIVE,
      });

      const rawToken = crypto.randomBytes(32).toString("hex");

      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      await this._setupTokenRepo.create({
        providerId: provider._id,
        hashedToken,
        expiresAt: new Date(Date.now() + 86400000),
      });

      const setupLink = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/provider/setup-password?token=${rawToken}`;

      await this._mailService.sendGenericEmail(
        provider.email,
        "Provider Approved",
        `Setup your password: ${setupLink}`
      );
    }

    return request;
  }
}
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { AdminDashboardDTO } from "../../shared/dto/admin/adminDashboard.dto";
import { logger } from "../../shared/logger/logger";
import { IAdminRepository } from "../../types/repositories/admin/IAdminRepository";
@injectable()
export class AdminService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly _repo: IAdminRepository
  ) {}

  async getDashboard(adminId: string): Promise<AdminDashboardDTO> {
    logger.info(LOG_MESSAGES.ADMIN.DASHBOARD_ACCESSED, { adminId });

    return {
      totalUsers: 0,
      totalProviders: 0,
      totalTransactions: 0,
      revenue: 0,
    };
  }
}
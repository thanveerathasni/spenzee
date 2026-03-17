import { injectable } from "inversify";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/httpStatus";
import { AppError } from "../../shared/errors/AppError";

import { AdminDashboardDTO } from "../../shared/dto/admin/adminDashboard.dto";
import { IAdminService } from "../../types/services/admin/IAdminService";

@injectable()
export class AdminService implements IAdminService {
  async getDashboard(adminId: string): Promise<AdminDashboardDTO> {
    if (!adminId) {
      throw new AppError(ERROR_MESSAGES.AUTH.ACCESS_DENIED, HTTP_STATUS.UNAUTHORIZED);
    }

    return {
      totalUsers: 120,
      totalProviders: 30,
      totalTransactions: 540,
      revenue: 54000,
    };
  }
}
import { injectable } from "inversify";
import { IAdminService } from "../../types/services/admin/IAdminService";
import { AppError } from "../../shared/errors/AppError";
import { HTTP_STATUS } from "../../shared/constants/httpStatus";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";

@injectable()
export class AdminService implements IAdminService {
  async getDashboard(adminId: string) {
    if (!adminId) {
      throw new AppError(ERROR_MESSAGES.AUTH.ACCESS_DENIED, HTTP_STATUS.UNAUTHORIZED);
    }

    // TODO: Replace with repository calls
    const stats = {
      users: 120,
      revenue: 54000,
      alerts: 3,
    };

    return {
      adminId,
      stats,
    };
  }
}

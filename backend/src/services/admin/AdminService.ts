import { injectable } from "inversify";
import { IAdminService } from "../../types/services/admin/IAdminService";

@injectable()
export class AdminService implements IAdminService {
  async getDashboard(adminId: string) {
    return {
      adminId,
      stats: {
        users: 120,
        revenue: 54000,
        alerts: 3,
      },
    };
  }
}

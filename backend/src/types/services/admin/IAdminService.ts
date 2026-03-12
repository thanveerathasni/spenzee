import { AdminDashboardDTO } from "../../../shared/dto/admin/adminDashboard.dto";

export interface IAdminService {

  getDashboard(adminId: string): Promise<AdminDashboardDTO>;

}
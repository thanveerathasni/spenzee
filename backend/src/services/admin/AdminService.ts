import { injectable } from "inversify";
import { IAdminService } from "../../types/services/admin/IAdminService";

@injectable()
export class AdminService implements IAdminService {
  async getDashboard() {
    return {
      status: "ok",
      message: "Admin dashboard ready",
    };
  }
}

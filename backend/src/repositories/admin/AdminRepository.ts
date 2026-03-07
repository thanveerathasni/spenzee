import { injectable } from "inversify";
import { AdminModel, IAdmin } from "../../models/Admin.model";
import { IAdminRepository } from "../../types/repositories/admin/IAdminRepository";

@injectable()
export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return AdminModel.findOne({ email }).exec();
  }
}
import { injectable } from "inversify";
import { IAdminRepository } from "../../types/repositories/IAdminRepository";
import { AdminModel, IAdmin } from "../../models/Admin.model";

@injectable()
export class AdminRepository implements IAdminRepository {

  async findByEmail(email: string): Promise<IAdmin | null> {
    return AdminModel.findOne({ email }).exec();
  }

  async findById(adminId: string): Promise<IAdmin | null> {
    return AdminModel.findById(adminId).exec();
  }
}

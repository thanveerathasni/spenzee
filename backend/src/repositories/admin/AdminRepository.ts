import { injectable } from "inversify";

import { AdminModel, IAdmin } from "../../models/Admin.model";
import { BaseRepository } from "../../shared/base/BaseRepository";
import { IAdminRepository } from "../../types/repositories/admin/IAdminRepository";


@injectable()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor() {
    super(AdminModel);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return this.findOne({ email });
  }

  async findActiveAdmins(): Promise<IAdmin[]> {
    return this.model.find({ isActive: true }).exec();
  }
}

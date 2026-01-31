import { IAdmin } from "../../models/Admin.model";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  findById(adminId: string): Promise<IAdmin | null>;
}

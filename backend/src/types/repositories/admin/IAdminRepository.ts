import { IAdmin } from "../../../models/Admin.model";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  findActiveAdmins(): Promise<IAdmin[]>;
  findById(id: string): Promise<IAdmin | null>;
   create(
    data: Partial<IAdmin>,
  ): Promise<IAdmin>;
}

import { IAdmin } from "../../../models/Admin.model";

export interface AdminDTO {
  id: string;
  email: string;
}

export class AdminMapper {
  static toDTO(admin: IAdmin): AdminDTO {
    return {
      id: admin._id.toString(),
      email: admin.email,
    };
  }
}
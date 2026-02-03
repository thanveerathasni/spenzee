import { injectable, inject } from "inversify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { TYPES } from "../../di/types";
import { IAdminAuthService } from "../../types/services/admin/IAdminAuthService";
import { IAdminRepository } from "../../types/repositories/IAdminRepository";
import { ROLES } from "../../constants/roles";

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly adminRepo: IAdminRepository
  ) {}

  async login(email: string, password: string) {
    const admin = await this.adminRepo.findByEmail(email);

    if (!admin || !admin.isActive) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // ✅ USE ADMIN SECRET (THIS WAS THE BUG)
    const accessToken = jwt.sign(
      {
        adminId: admin._id.toString(),
        role: ROLES.ADMIN,
      },
      process.env.JWT_ADMIN_SECRET as string,
      { expiresIn: "15m" }
    );

    return {
      accessToken,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
      },
    };
  }
}

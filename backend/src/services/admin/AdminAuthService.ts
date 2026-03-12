import bcrypt from "bcryptjs";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";

import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/httpStatus";
import { ROLES } from "../../shared/constants/roles";

import { AppError } from "../../shared/errors/AppError";
import { createAccessToken } from "../../shared/utils/token.util";
import { IAdminRepository } from "../../types/repositories/admin/IAdminRepository";
import { IAdminAuthService } from "../../types/services/admin/IAdminAuthService";

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly adminRepo: IAdminRepository,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.adminRepo.findByEmail(email);

    if (!admin || !admin.isActive) {
      throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const accessToken = createAccessToken({
      userId: admin._id.toString(),
      role: ROLES.ADMIN,
    });

    return {
      accessToken,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
      },
    };
  }
}

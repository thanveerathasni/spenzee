import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";

import { TYPES } from "../../di/types";

import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/httpStatus";
import { ROLES } from "../../shared/constants/roles";

import { AppError } from "../../shared/errors/AppError";
import { logger } from "../../shared/logger/logger";
import { AdminMapper } from "../../shared/mapper/admin/AdminMapper";
import { createAccessToken } from "../../shared/utils/token.util";

import { IAdminRepository } from "../../types/repositories/admin/IAdminRepository";


@injectable()
export class AdminAuthService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly _adminRepository: IAdminRepository,
  ) {}

  async login(email: string, password: string) {
    logger.info("Admin login attempt", { email });

    const admin = await this._adminRepository.findByEmail(email);

    if (!admin || !admin.isActive) {
      logger.warn("Admin login failed - invalid admin", { email });
      throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      logger.warn("Admin login failed - wrong password", { email });
      throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const accessToken = createAccessToken({
      userId: admin._id.toString(),
      role: ROLES.ADMIN,
    });

    logger.info("Admin login success", { adminId: admin._id.toString() });

    return {
      accessToken,
      admin: AdminMapper.toDTO(admin),
    };
  }
}
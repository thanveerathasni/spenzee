import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";

import { TYPES } from "../../di/types";

import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/httpStatus";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
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
    logger.info(LOG_MESSAGES.ADMIN.LOGIN_ATTEMPT, { email });

    const admin = await this._adminRepository.findByEmail(email);

    if (!admin || !admin.isActive) {
      logger.warn(LOG_MESSAGES.ADMIN.LOGIN_FAILED, { email });
      throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      logger.warn(LOG_MESSAGES.ADMIN.LOGIN_FAILED, { email });
      throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const accessToken = createAccessToken({
      userId: admin._id.toString(),
      role: ROLES.ADMIN,
    });

    logger.info(LOG_MESSAGES.ADMIN.LOGIN_SUCCESS, { adminId: admin._id.toString() });

    return {
      accessToken,
      admin: AdminMapper.toDTO(admin),
    };
  }
}
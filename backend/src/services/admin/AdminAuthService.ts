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
import { createRefreshToken, verifyRefreshToken } from "../../shared/utils/token.util";
import { IAdminRepository } from "../../types/repositories/admin/IAdminRepository";


@injectable()
export class AdminAuthService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly _adminRepository: IAdminRepository,
  ) {}

async login(
  email: string,
  password: string,
) {
  logger.info(
    LOG_MESSAGES.ADMIN.LOGIN_ATTEMPT,
    { email },
  );

  const admin =
    await this._adminRepository.findByEmail(
      email,
    );

  if (!admin) {
    logger.warn(
      "Admin not found",
      { email },
    );

    throw new AppError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      401,
    );
  }

  if (!admin.isActive) {
    logger.warn(
      "Admin inactive",
      { email },
    );

    throw new AppError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      401,
    );
  }

  const valid =
    await bcrypt.compare(
      password,
      admin.password,
    );

  if (!valid) {
    logger.warn(
      "Password mismatch",
      { email },
    );

    throw new AppError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      401,
    );
  }

  /* ============================================== */
  /* TOKENS */
  /* ============================================== */

  const payload = {
    userId:
      admin._id.toString(),

    role:
      ROLES.ADMIN,
  };

  const accessToken =
    createAccessToken(
      payload,
    );

  const refreshToken =
    createRefreshToken(
      payload,
    );

  logger.info(
    LOG_MESSAGES.ADMIN.LOGIN_SUCCESS,
    {
      adminId:
        admin._id.toString(),
    },
  );

  return {
    accessToken,

    refreshToken,

    admin:
      AdminMapper.toDTO(
        admin,
      ),
  };
}

async refresh(
  refreshToken: string,
) {
  const payload =
    verifyRefreshToken(
      refreshToken,
    );

  const admin =
    await this._adminRepository.findById(
      payload.userId,
    );

  if (!admin) {
    throw new AppError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      401,
    );
  }

  const accessToken =
    createAccessToken({
      userId:
        admin._id.toString(),

      role:
        ROLES.ADMIN,
    });

  return {
    accessToken,

    admin:
      AdminMapper.toDTO(
        admin,
      ),
  };
}

}
import { injectable, inject } from "inversify";
import bcrypt from "bcryptjs";

import { TYPES } from "../../di/types";
import {
  IAdminAuthService,
  AdminAuthResponse
} from "../../types/services/admin/IAdminAuthService";
import { IAdminRepository } from "../../types/repositories/IAdminRepository";
import { IRefreshTokenRepository } from "../../types/repositories/IRefreshTokenRepository";

import { UnauthorizedError } from "../../utils/errors";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { ROLES } from "../../constants/roles";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../../utils/jwt";
import { hashRefreshToken } from "../../utils/refreshTokenHash";

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly _adminRepository: IAdminRepository,

    @inject(TYPES.RefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository
  ) {}

  // 🔐 LOGIN
  async login(
    email: string,
    password: string
  ): Promise<AdminAuthResponse> {
    const admin = await this._adminRepository.findByEmail(email);

    if (!admin || !admin.isActive) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
      );
    }

    const isValidPassword = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
      );
    }

    const accessToken = generateAccessToken({
      userId: admin._id.toString(),
      role: ROLES.ADMIN
    });

const refreshToken = generateRefreshToken({
  userId: admin._id.toString(),
  role: ROLES.ADMIN
});

await this._refreshTokenRepository.create({
  userId: admin._id,
  tokenHash: hashRefreshToken(refreshToken),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});

return {
  accessToken,
  refreshToken,
  admin: {
    id: admin._id.toString(),
    email: admin.email
  }
};

  }

  // 🔁 REFRESH
  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    if (payload.role !== ROLES.ADMIN) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.ACCESS_DENIED
      );
    }

    const tokenHash = hashRefreshToken(refreshToken);

    const storedToken =
      await this._refreshTokenRepository.findValidTokenByHash(
        tokenHash
      );

    if (!storedToken) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID
      );
    }

    const admin = await this._adminRepository.findById(
      payload.userId
    );

    if (!admin || !admin.isActive) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.ACCESS_DENIED
      );
    }

    const accessToken = generateAccessToken({
      userId: admin._id.toString(),
      role: ROLES.ADMIN
    });

    return {
      accessToken,
      admin: {
        id: admin._id.toString(),
        email: admin.email
      }
    };
  }

  // 🚪 LOGOUT
  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);
    await this._refreshTokenRepository.deleteByTokenHash(
      tokenHash
    );
  }
}

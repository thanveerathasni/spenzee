// // import bcrypt from "bcrypt";
// // import { OAuth2Client } from "google-auth-library";
// // import { injectable, inject } from "inversify";

// // import { TYPES } from "../../di/types";

// // import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
// // import { LOG_MESSAGES } from "../../shared/constants/logMessages";
// // import { ROLES } from "../../shared/constants/roles";

// // import { UnauthorizedError, BadRequestError } from "../../shared/errors/errors";
// // import { logger } from "../../shared/logger/logger";
// // import { AuthMapper } from "../../shared/mapper/AuthMapper";

// // import { generateOtp, hashOtp, compareOtp } from "../../shared/utils/otp.util";
// // import { comparePasswords, hashPassword } from "../../shared/utils/password";
// // import { hashRefreshToken } from "../../shared/utils/refreshTokenHash";
// // import { generateResetToken, hashResetToken } from "../../shared/utils/resetPasswordToken";
// // import {
// //   createAccessToken,
// //   createRefreshToken,
// //   verifyRefreshToken,
// // } from "../../shared/utils/token.util";

// // import { IOtpRepository } from "../../types/repositories/IOtpRepository";
// // import { IRefreshTokenRepository } from "../../types/repositories/IRefreshTokenRepository";
// // import { IResetPasswordRepository } from "../../types/repositories/IResetPasswordRepository";
// // import { IUserRepository } from "../../types/repositories/user/IUserRepository";

// // import { IMailService } from "../../types/services/IMailService";
// // import { IAuthService, AuthResponse } from "../../types/services/user/IAuthService";

// // @injectable()
// // export class AuthService implements IAuthService {
// //   private readonly _oauthClient: OAuth2Client;

// //   constructor(
// //     @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
// //     @inject(TYPES.OtpRepository) private readonly _otpRepository: IOtpRepository,
// //     @inject(TYPES.MailService) private readonly _mailService: IMailService,
// //     @inject(TYPES.RefreshTokenRepository) private readonly _refreshRepo: IRefreshTokenRepository,
// //     @inject(TYPES.ResetPasswordRepository) private readonly _resetRepo: IResetPasswordRepository,
// //   ) {
// //     this._oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// //   }

// //   async login(email: string, password: string): Promise<AuthResponse> {
// //     const user = await this._userRepository.findByEmail(email);

// //     if (!user || !user.password) {
// //       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
// //     }

// //     const valid = await comparePasswords(password, user.password);

// //     if (!valid) {
// //       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
// //     }

// //     const payload = { userId: user._id.toString(), role: user.role };

// //     const accessToken = createAccessToken(payload);
// //     const refreshToken = createRefreshToken(payload);

// //     await this._refreshRepo.create({
// //       userId: user._id,
// //       tokenHash: hashRefreshToken(refreshToken),
// //       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
// //     });

// //     return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
// //   }

// //   async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
// //     const payload = verifyRefreshToken(refreshToken);
// //     const tokenHash = hashRefreshToken(refreshToken);

// //     const stored = await this._refreshRepo.findValidTokenByHash(tokenHash);

// //     if (!stored) {
// //       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
// //     }

// //     const user = await this._userRepository.findById(payload.userId);
// //     if (!user) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);

// //     const newAccessToken = createAccessToken({
// //       userId: user._id.toString(),
// //       role: user.role,
// //     });

// //     const newRefreshToken = createRefreshToken({
// //       userId: user._id.toString(),
// //       role: user.role,
// //     });

// //     await this._refreshRepo.create({
// //       userId: user._id,
// //       tokenHash: hashRefreshToken(newRefreshToken),
// //       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
// //     });

// //     return AuthMapper.toAuthResponse(user, newAccessToken, newRefreshToken);
// //   }

// //   async logout(refreshToken: string): Promise<void> {
// //     const tokenHash = hashRefreshToken(refreshToken);
// //     await this._refreshRepo.deleteByTokenHash(tokenHash);
// //   }

// //   async signup(email: string, password: string): Promise<void> {
// //     const exists = await this._userRepository.findByEmail(email);

// //     if (exists) {
// //       throw new BadRequestError(ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS);
// //     }

// //     const hashedPassword = await hashPassword(password);

// //     await this._userRepository.create({
// //       email,
// //       name: email.split("@")[0],
// //       password: hashedPassword,
// //       role: ROLES.USER,
// //       isVerified: false,
// //     });

// //     const otp = generateOtp();

// //     await this._otpRepository.create(
// //       email,
// //       await hashOtp(otp),
// //       new Date(Date.now() + 10 * 60 * 1000),
// //     );

// //     await this._mailService.sendOtp(email, otp);
// //   }

// //   async verifyOtp(email: string, otp: string): Promise<void> {
// //     const record = await this._otpRepository.findByEmail(email);

// //     if (!record) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.NO_OTP_FOUND);

// //     const valid = await compareOtp(otp, record.otpHash);

// //     if (!valid) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);

// //     await this._userRepository.verifyUser(email);
// //     await this._otpRepository.deleteByEmail(email);
// //   }

// //   async resendOtp(email: string): Promise<void> {
// //     const otp = generateOtp();

// //     await this._otpRepository.updateOtp(
// //       email,
// //       await hashOtp(otp),
// //       new Date(Date.now() + 10 * 60 * 1000),
// //     );

// //     await this._mailService.sendOtp(email, otp);
// //   }
// //   async forgotPassword(email: string): Promise<void> {
// //     const user = await this._userRepository.findByEmail(email);

// //     if (!user) {
// //       throw new BadRequestError("User not found");
// //     }

// //     const otp = generateOtp();

// //     await this._otpRepository.updateOtp(
// //       email,
// //       await hashOtp(otp),
// //       new Date(Date.now() + 5 * 60 * 1000)
// //     );

// //     await this._mailService.sendOtp(email, otp);
// //   }

// //   async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
// //     const record = await this._otpRepository.findByEmail(email);

// //     if (!record) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.NO_OTP_FOUND);

// //     if (record.expiresAt < new Date()) {
// //       throw new UnauthorizedError("OTP expired");
// //     }

// //     const valid = await compareOtp(otp, record.otpHash);

// //     if (!valid) {
// //       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
// //     }

// //     const user = await this._userRepository.findByEmail(email);
// //     if (!user) throw new BadRequestError("User not found");

// //     const hashed = await hashPassword(newPassword);

// //     await this._userRepository.updatePassword(user._id.toString(), hashed);
// //     await this._otpRepository.deleteByEmail(email);
// //   }
// //   // 🔥 EMAIL CHANGE FLOW

// //   async sendEmailChangeOtp(email: string) {
// //     const otp = generateOtp();

// //     await this._otpRepository.updateOtp(
// //       email,
// //       await hashOtp(otp),
// //       new Date(Date.now() + 5 * 60 * 1000),
// //     );

// //     await this._mailService.sendOtp(email, otp);
// //   }

// //   async verifyEmailChangeOtp(email: string, otp: string) {
// //     const record = await this._otpRepository.findByEmail(email);

// //     if (!record) throw new Error("No OTP");

// //     if (record.expiresAt < new Date()) {
// //       throw new Error("OTP expired");
// //     }

// //     const valid = await compareOtp(otp, record.otpHash);

// //     if (!valid) {
// //       throw new Error("Invalid OTP");
// //     }

// //     await this._otpRepository.deleteByEmail(email);
// //   }

// //   async updateEmail(userId: string, newEmail: string) {
// //     return this._userRepository.updateById(userId, {
// //       email: newEmail,
// //     });
// //   }

// //   // 🔐 PASSWORD FLOW

// //   async sendPasswordOtp(userId: string) {
// //     const user = await this._userRepository.findById(userId);
// //     if (!user) throw new Error("User not found");

// //     const otp = generateOtp();

// //     await this._otpRepository.updateOtp(
// //       user.email,
// //       await hashOtp(otp),
// //       new Date(Date.now() + 5 * 60 * 1000),
// //     );

// //     await this._mailService.sendOtp(user.email, otp);
// //   }

// //   async verifyPasswordOtp(email: string, otp: string) {
// //     const record = await this._otpRepository.findByEmail(email);

// //     if (!record) throw new Error("No OTP");

// //     if (record.expiresAt < new Date()) {
// //       throw new Error("OTP expired");
// //     }

// //     const valid = await compareOtp(otp, record.otpHash);

// //     if (!valid) {
// //       throw new Error("Invalid OTP");
// //     }

// //     await this._otpRepository.deleteByEmail(email);
// //   }

// //   async updatePassword(userId: string, newPassword: string) {
// //     const hashed = await bcrypt.hash(newPassword, 10);

// //     await this._userRepository.updatePassword(userId, hashed);
// //   }

// //   async googleLogin(credential: string): Promise<AuthResponse> {
// //     const ticket = await this._oauthClient.verifyIdToken({
// //       idToken: credential,
// //       audience: process.env.GOOGLE_CLIENT_ID,
// //     });

// //     const payload = ticket.getPayload();

// //     if (!payload?.email) {
// //       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
// //     }

// //     let user = await this._userRepository.findByEmail(payload.email);

// //     if (!user) {
// //       user = await this._userRepository.create({
// //         email: payload.email,
// //         name: payload.name ?? payload.email.split("@")[0],
// //         password: null,
// //         role: ROLES.USER,
// //         isVerified: true,
// //         provider: "google",
// //       });
// //     }

// //     const accessToken = createAccessToken({
// //       userId: user._id.toString(),
// //       role: user.role,
// //     });

// //     const refreshToken = createRefreshToken({
// //       userId: user._id.toString(),
// //       role: user.role,
// //     });

// //     await this._refreshRepo.create({
// //       userId: user._id,
// //       tokenHash: hashRefreshToken(refreshToken),
// //       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
// //     });

// //     return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
// //   }
// // }


















// import bcrypt from "bcrypt";
// import { OAuth2Client } from "google-auth-library";
// import { injectable, inject } from "inversify";

// import { TYPES } from "../../di/types";

// import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
// import { LOG_MESSAGES } from "../../shared/constants/logMessages";
// import { ROLES } from "../../shared/constants/roles";

// import { UnauthorizedError, BadRequestError } from "../../shared/errors/errors";
// import { logger } from "../../shared/logger/logger";
// import { AuthMapper } from "../../shared/mapper/AuthMapper";

// import { generateOtp, hashOtp, compareOtp } from "../../shared/utils/otp.util";
// import { comparePasswords, hashPassword } from "../../shared/utils/password";
// import { hashRefreshToken } from "../../shared/utils/refreshTokenHash";
// import { generateResetToken, hashResetToken } from "../../shared/utils/resetPasswordToken";
// import {
//   createAccessToken,
//   createRefreshToken,
//   verifyRefreshToken,
// } from "../../shared/utils/token.util";

// import { IOtpRepository } from "../../types/repositories/IOtpRepository";
// import { IRefreshTokenRepository } from "../../types/repositories/IRefreshTokenRepository";
// import { IResetPasswordRepository } from "../../types/repositories/IResetPasswordRepository";
// import { IUserRepository } from "../../types/repositories/user/IUserRepository";

// import { IMailService } from "../../types/services/IMailService";
// import { IAuthService, AuthResponse } from "../../types/services/user/IAuthService";

// @injectable()
// export class AuthService implements IAuthService {
//   private readonly _oauthClient: OAuth2Client;

//   constructor(
//     @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
//     @inject(TYPES.OtpRepository) private readonly _otpRepository: IOtpRepository,
//     @inject(TYPES.MailService) private readonly _mailService: IMailService,
//     @inject(TYPES.RefreshTokenRepository) private readonly _refreshRepo: IRefreshTokenRepository,
//     @inject(TYPES.ResetPasswordRepository) private readonly _resetRepo: IResetPasswordRepository,
//   ) {
//     this._oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//   }

//   async login(email: string, password: string): Promise<AuthResponse> {
//     const user = await this._userRepository.findByEmail(email);

//     if (!user || !user.password) {
//       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
//     }

//     const valid = await comparePasswords(password, user.password);

//     if (!valid) {
//       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
//     }

//     const payload = { userId: user._id.toString(), role: user.role };

//     const accessToken = createAccessToken(payload);
//     const refreshToken = createRefreshToken(payload);

//     await this._refreshRepo.create({
//       userId: user._id,
//       tokenHash: hashRefreshToken(refreshToken),
//       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     });

//     return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
//   }

//   async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
//     const payload = verifyRefreshToken(refreshToken);
//     const tokenHash = hashRefreshToken(refreshToken);

//     const stored = await this._refreshRepo.findValidTokenByHash(tokenHash);

//     if (!stored) {
//       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
//     }

//     const user = await this._userRepository.findById(payload.userId);
//     if (!user) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);

//     const newAccessToken = createAccessToken({
//       userId: user._id.toString(),
//       role: user.role,
//     });

//     const newRefreshToken = createRefreshToken({
//       userId: user._id.toString(),
//       role: user.role,
//     });

//     await this._refreshRepo.create({
//       userId: user._id,
//       tokenHash: hashRefreshToken(newRefreshToken),
//       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     });

//     return AuthMapper.toAuthResponse(user, newAccessToken, newRefreshToken);
//   }

//   async logout(refreshToken: string): Promise<void> {
//     const tokenHash = hashRefreshToken(refreshToken);
//     await this._refreshRepo.deleteByTokenHash(tokenHash);
//   }

//   async signup(email: string, password: string): Promise<void> {
//     const exists = await this._userRepository.findByEmail(email);

//     if (exists) {
//       throw new BadRequestError(ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS);
//     }

//     const hashedPassword = await hashPassword(password);

//     await this._userRepository.create({
//       email,
//       name: email.split("@")[0],
//       password: hashedPassword,
//       role: ROLES.USER,
//       isVerified: false,
//     });

//     const otp = generateOtp();

//     await this._otpRepository.create(
//       email,
//       await hashOtp(otp),
//       new Date(Date.now() + 10 * 60 * 1000),
//     );

//     await this._mailService.sendOtp(email, otp);
//   }

//   async verifyOtp(email: string, otp: string): Promise<void> {
//     const record = await this._otpRepository.findByEmail(email);

//     if (!record) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.NO_OTP_FOUND);

//     const valid = await compareOtp(otp, record.otpHash);

//     if (!valid) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);

//     await this._userRepository.verifyUser(email);
//     await this._otpRepository.deleteByEmail(email);
//   }

//   async resendOtp(email: string): Promise<void> {
//     const otp = generateOtp();

//     await this._otpRepository.updateOtp(
//       email,
//       await hashOtp(otp),
//       new Date(Date.now() + 10 * 60 * 1000),
//     );

//     await this._mailService.sendOtp(email, otp);
//   }
// async forgotPassword(email: string): Promise<void> {
//   const user = await this._userRepository.findByEmail(email);

//   if (!user) {
//     throw new BadRequestError("User not found");
//   }

//   const resetToken = generateResetToken();

//   await this._otpRepository.updateOtp(
//     email,
//     await hashOtp(resetToken),
//     new Date(Date.now() + 10 * 60 * 1000)
//   );

//   await this._mailService.sendResetPasswordEmail(email, resetToken);
// }


// async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
//   const record = await this._otpRepository.findByEmail(email);

//   if (!record) {
//     throw new UnauthorizedError("No reset request found");
//   }

//   if (record.expiresAt < new Date()) {
//     throw new UnauthorizedError("Token expired");
//   }

//   const valid = await compareOtp(token, record.otpHash);

//   if (!valid) {
//     throw new UnauthorizedError("Invalid token");
//   }

//   const user = await this._userRepository.findByEmail(email);
//   if (!user) throw new BadRequestError("User not found");

//   const hashedPassword = await hashPassword(newPassword);

//   await this._userRepository.updatePassword(
//     user._id.toString(),
//     hashedPassword
//   );

//   await this._otpRepository.deleteByEmail(email);
// }


// async sendEmailChangeOtp(email: string): Promise<void> {
//   const otp = generateOtp();

//   await this._otpRepository.updateOtp(
//     email,
//     await hashOtp(otp),
//     new Date(Date.now() + 5 * 60 * 1000)
//   );

//   await this._mailService.sendOtp(email, otp);
// }

// async verifyEmailChangeOtp(email: string, otp: string): Promise<void> {
//   const record = await this._otpRepository.findByEmail(email);

//   if (!record) throw new Error("No OTP");

//   if (record.expiresAt < new Date()) {
//     throw new Error("OTP expired");
//   }

//   const valid = await compareOtp(otp, record.otpHash);

//   if (!valid) {
//     throw new Error("Invalid OTP");
//   }

//   await this._otpRepository.deleteByEmail(email);
// }

// async updateEmail(userId: string, newEmail: string) {
//   return this._userRepository.updateById(userId, {
//     email: newEmail,
//   });
// }

// /* ================= PASSWORD (LOGGED-IN USER) ================= */

// async sendPasswordOtp(userId: string): Promise<void> {
//   const user = await this._userRepository.findById(userId);
//   if (!user) throw new Error("User not found");

//   const otp = generateOtp();

//   await this._otpRepository.updateOtp(
//     user.email,
//     await hashOtp(otp),
//     new Date(Date.now() + 5 * 60 * 1000)
//   );

//   await this._mailService.sendOtp(user.email, otp);
// }

// async verifyPasswordOtp(email: string, otp: string): Promise<void> {
//   const record = await this._otpRepository.findByEmail(email);

//   if (!record) throw new Error("No OTP");

//   if (record.expiresAt < new Date()) {
//     throw new Error("OTP expired");
//   }

//   const valid = await compareOtp(otp, record.otpHash);

//   if (!valid) {
//     throw new Error("Invalid OTP");
//   }

//   await this._otpRepository.deleteByEmail(email);
// }

// /* ================= GOOGLE LOGIN ================= */

// async googleLogin(credential: string): Promise<AuthResponse> {
//   const ticket = await this._oauthClient.verifyIdToken({
//     idToken: credential,
//     audience: process.env.GOOGLE_CLIENT_ID,
//   });

//   const payload = ticket.getPayload();

//   if (!payload?.email) {
//     throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
//   }

//   let user = await this._userRepository.findByEmail(payload.email);

//   if (!user) {
//     user = await this._userRepository.create({
//       email: payload.email,
//       name: payload.name ?? payload.email.split("@")[0],
//       password: null,
//       role: ROLES.USER,
//       isVerified: true,
//       provider: "google",
//     });
//   }

//   const accessToken = createAccessToken({
//     userId: user._id.toString(),
//     role: user.role,
//   });

//   const refreshToken = createRefreshToken({
//     userId: user._id.toString(),
//     role: user.role,
//   });

//   await this._refreshRepo.create({
//     userId: user._id,
//     tokenHash: hashRefreshToken(refreshToken),
//     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//   });

//   return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
// }
// }




















import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";

import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/httpStatus";
import { ROLES } from "../../shared/constants/roles";

import { UnauthorizedError, BadRequestError } from "../../shared/errors/errors";
import { AuthMapper } from "../../shared/mapper/AuthMapper";

import { generateOtp, hashOtp, compareOtp } from "../../shared/utils/otp.util";
import { comparePasswords, hashPassword } from "../../shared/utils/password";
import { hashRefreshToken } from "../../shared/utils/refreshTokenHash";
import { generateResetToken } from "../../shared/utils/resetPasswordToken";

import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/token.util";

import { IOtpRepository } from "../../types/repositories/IOtpRepository";
import { IRefreshTokenRepository } from "../../types/repositories/IRefreshTokenRepository";
import { IUserRepository } from "../../types/repositories/user/IUserRepository";

import { IMailService } from "../../types/services/IMailService";
import { IAuthService, AuthResponse } from "../../types/services/user/IAuthService";

@injectable()
export class AuthService implements IAuthService {
  private readonly _oauthClient: OAuth2Client;

  constructor(
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(TYPES.OtpRepository) private readonly _otpRepository: IOtpRepository,
    @inject(TYPES.MailService) private readonly _mailService: IMailService,
    @inject(TYPES.RefreshTokenRepository) private readonly _refreshRepo: IRefreshTokenRepository,
  ) {
    this._oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this._userRepository.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }
    if (!user.isActive) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCOUNT_BLOCKED);
    }
    const valid = await comparePasswords(password, user.password);

    if (!valid) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const payload = { userId: user._id.toString(), role: user.role };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    await this._refreshRepo.create({
      userId: user._id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashRefreshToken(refreshToken);

    const stored = await this._refreshRepo.findValidTokenByHash(tokenHash);

    if (!stored) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
    }

    const user = await this._userRepository.findById(payload.userId);
    if (!user) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);

    const newAccessToken = createAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const newRefreshToken = createRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    await this._refreshRepo.create({
      userId: user._id,
      tokenHash: hashRefreshToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return AuthMapper.toAuthResponse(user, newAccessToken, newRefreshToken);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);
    await this._refreshRepo.deleteByTokenHash(tokenHash);
  }

  async signup(email: string, password: string): Promise<void> {
    const exists = await this._userRepository.findByEmail(email);

    if (exists) {
      throw new BadRequestError(ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await hashPassword(password);

    await this._userRepository.create({
      email,
      name: email.split("@")[0],
      password: hashedPassword,
      role: ROLES.USER,
      isVerified: false,
    });

    const otp = generateOtp();

    await this._otpRepository.create(
      email,
      await hashOtp(otp),
      new Date(Date.now() + 10 * 60 * 1000),
    );

    await this._mailService.sendOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const record = await this._otpRepository.findByEmail(email);

    if (!record) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.NO_OTP_FOUND);

    const valid = await compareOtp(otp, record.otpHash);

    if (!valid) throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);

    await this._userRepository.verifyUser(email);
    await this._otpRepository.deleteByEmail(email);
  }

  async resendOtp(email: string): Promise<void> {
    const otp = generateOtp();

    await this._otpRepository.updateOtp(
      email,
      await hashOtp(otp),
      new Date(Date.now() + 10 * 60 * 1000),
    );

    await this._mailService.sendOtp(email, otp);
  }


  async forgotPassword(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) throw new BadRequestError("User not found");

    const token = generateResetToken();

    await this._otpRepository.updateOtp(
      email,
      await hashOtp(token),
      new Date(Date.now() + 10 * 60 * 1000)
    );

    await this._mailService.sendResetPasswordEmail(email, token);
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    const record = await this._otpRepository.findByEmail(email);

    if (!record) {
      throw new UnauthorizedError("No reset request found");
    }

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedError("Token expired");
    }

    const valid = await compareOtp(token, record.otpHash);

    if (!valid) {
      throw new UnauthorizedError("Invalid token");
    }

    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const hashedPassword = await hashPassword(newPassword);

    await this._userRepository.updatePassword(
      user._id.toString(),
      hashedPassword
    );

    await this._otpRepository.deleteByEmail(email);
  }


  /* ================= EMAIL CHANGE ================= */

  async sendEmailChangeOtp(email: string): Promise<void> {
    const otp = generateOtp();

    await this._otpRepository.updateOtp(
      email,
      await hashOtp(otp),
      new Date(Date.now() + 5 * 60 * 1000)
    );

    await this._mailService.sendOtp(email, otp);
  }

  async verifyEmailChangeOtp(email: string, otp: string): Promise<void> {
    const record = await this._otpRepository.findByEmail(email);

    if (!record) throw new Error("No OTP");

    if (record.expiresAt < new Date()) throw new Error("OTP expired");

    const valid = await compareOtp(otp, record.otpHash);

    if (!valid) throw new Error("Invalid OTP");

    await this._otpRepository.deleteByEmail(email);
  }

  async updateEmail(userId: string, newEmail: string) {
    return this._userRepository.updateById(userId, { email: newEmail });
  }

  /* ================= PASSWORD ================= */

  async sendPasswordOtp(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const otp = generateOtp();

    await this._otpRepository.updateOtp(
      user.email,
      await hashOtp(otp),
      new Date(Date.now() + 5 * 60 * 1000)
    );

    await this._mailService.sendOtp(user.email, otp);
  }

  async verifyPasswordOtp(email: string, otp: string): Promise<void> {
    const record = await this._otpRepository.findByEmail(email);

    if (!record) throw new Error("No OTP");

    if (record.expiresAt < new Date()) throw new Error("OTP expired");

    const valid = await compareOtp(otp, record.otpHash);

    if (!valid) throw new Error("Invalid OTP");

    await this._otpRepository.deleteByEmail(email);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashed = await bcrypt.hash(newPassword, 10);
    await this._userRepository.updatePassword(userId, hashed);
  }

  async googleLogin(credential: string): Promise<AuthResponse> {
    const ticket = await this._oauthClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    let user = await this._userRepository.findByEmail(payload.email);

    if (!user) {
      user = await this._userRepository.create({
        email: payload.email,
        name: payload.name ?? payload.email.split("@")[0],
        password: null,
        role: ROLES.USER,
        isVerified: true,
        provider: "google",
      });
    }

    const accessToken = createAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const refreshToken = createRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    await this._refreshRepo.create({
      userId: user._id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
  }
}
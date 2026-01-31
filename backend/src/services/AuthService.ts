// import { injectable, inject } from "inversify";
// import { TYPES } from "../di/types";
// import { OAuth2Client } from "google-auth-library";
// import { Types } from "mongoose";

// import { IAuthService } from "../types/services/IAuthService";
// import { IUserRepository } from "../types/repositories/IUserRepository";
// import { IOtpRepository } from "../types/repositories/IOtpRepository";
// import { IMailService } from "../types/services/IMailService";
// import { IRefreshTokenRepository } from "../types/repositories/IRefreshTokenRepository";
// import { IResetPasswordRepository } from "../types/repositories/IResetPasswordRepository";

// import { UnauthorizedError, BadRequestError } from "../utils/errors";
// import { ERROR_MESSAGES } from "../constants/errorMessages";
// import { IUser } from "../models/User.model";

// import { comparePasswords, hashPassword } from "../utils/password";
// import {
//   generateAccessToken,
//   generateRefreshToken,
//   verifyRefreshToken,
// } from "../utils/jwt";
// import { hashRefreshToken } from "../utils/refreshTokenHash";
// import {
//   generateResetToken,
//   hashResetToken,
// } from "../utils/resetPasswordToken";
// import { generateOtp } from "../utils/otp";
// import { hashOtp, compareOtp } from "../utils/otpHash";



// @injectable()
// export class AuthService implements IAuthService {
//   private readonly oauthClient: OAuth2Client;

//   constructor(
//     @inject(TYPES.UserRepository)
//     private readonly userRepository: IUserRepository,

//     @inject(TYPES.OtpRepository)
//     private readonly otpRepository: IOtpRepository,

//     @inject(TYPES.MailService)
//     private readonly mailService: IMailService,

//     @inject(TYPES.RefreshTokenRepository)
//     private readonly refreshTokenRepository: IRefreshTokenRepository,

//     @inject(TYPES.ResetPasswordRepository)
//     private readonly resetPasswordRepository: IResetPasswordRepository
//   ) {
//     this.oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//   }

//   // ================= LOGIN =================
//   async login(
//     email: string,
//     password: string
//   ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
//     const user = await this.userRepository.findByEmail(email);

//     if (!user || !user.password) {
//       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
//     }

//     const isPasswordValid = await comparePasswords(password, user.password);
//     if (!isPasswordValid) {
//       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
//     }

//     // if (!user.isVerified) {
//     //   throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCOUNT_NOT_VERIFIED);
//     // }

//     const payload = {
//       userId: user._id.toString(),
//       role: user.role,
//     };

//     const accessToken = generateAccessToken(payload);
//     const refreshToken = generateRefreshToken(payload);

//     await this.refreshTokenRepository.create({
//       userId: user._id,
//       tokenHash: hashRefreshToken(refreshToken),
//       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     });

//     return { accessToken, refreshToken, user };
//   }

//   // ================= REFRESH =================
//   async refreshAccessToken(refreshToken: string) {
//     let payload;
//     try {
//       payload = verifyRefreshToken(refreshToken);
//     } catch {
//       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
//     }

//     const stored = await this.refreshTokenRepository.findByTokenHash(
//       hashRefreshToken(refreshToken)
//     );

//     if (!stored || stored.expiresAt < new Date()) {
//       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
//     }

//     await this.refreshTokenRepository.revokeToken(stored._id);

//     const newAccessToken = generateAccessToken(payload);
//     const newRefreshToken = generateRefreshToken(payload);

//     await this.refreshTokenRepository.create({
//       userId: new Types.ObjectId(payload.userId),
//       tokenHash: hashRefreshToken(newRefreshToken),
//       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     });

//     return { accessToken: newAccessToken, refreshToken: newRefreshToken };
//   }

//   // ================= SIGNUP =================
//   async signup(email: string, password: string): Promise<void> {
//     const exists = await this.userRepository.findByEmail(email);
//     if (exists) {
//       throw new BadRequestError(ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS);
//     }

//     const hashedPassword = await hashPassword(password);

//     await this.userRepository.create({
//       email,
//       name: email.split("@")[0],
//       password: hashedPassword,
//       role: "user",
//       isVerified: false,
//     });

//     const otp = generateOtp();

//     await this.otpRepository.create(
//       email,
//       await hashOtp(otp),
//       new Date(Date.now() + 10 * 60 * 1000)
//     );

//     await this.mailService.sendOtp(email, otp);
//   }

//   async verifyOtp(email: string, otp: string): Promise<void> {
//     const record = await this.otpRepository.findByEmail(email);

//     if (!record || record.expiresAt < new Date()) {
//       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
//     }

//     const valid = await compareOtp(otp, record.otpHash);
//     if (!valid) {
//       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
//     }

//     await this.userRepository.verifyUser(email);
//     await this.otpRepository.deleteByEmail(email);
//   }

//   async resendOtp(email: string): Promise<void> {
//     const otp = generateOtp();

//     await this.otpRepository.updateOtp(
//       email,
//       await hashOtp(otp),
//       new Date(Date.now() + 10 * 60 * 1000)
//     );

//     await this.mailService.sendOtp(email, otp);
//   }

//   // ================= PASSWORD RESET =================
//   async forgotPassword(email: string): Promise<string | null> {
//     const user = await this.userRepository.findByEmail(email);
//     if (!user) return null;

//     await this.resetPasswordRepository.deleteByUserId(user._id);

//     const resetToken = generateResetToken();

//     await this.resetPasswordRepository.create(
//       user._id,
//       hashResetToken(resetToken),
//       new Date(Date.now() + 15 * 60 * 1000)
//     );

//     return resetToken;
//   }

//   async sendResetPasswordEmail(
//     email: string,
//     resetToken: string
//   ): Promise<void> {
//     await this.mailService.sendResetPasswordEmail(email, resetToken);
//   }

//   async resetPassword(token: string, newPassword: string): Promise<void> {
//     const record = await this.resetPasswordRepository.findByTokenHash(
//       hashResetToken(token)
//     );

//     if (!record || record.expiresAt < new Date()) {
//       throw new BadRequestError(ERROR_MESSAGES.AUTH.RESET_TOKEN_INVALID);
//     }

//     await this.userRepository.updatePassword(
//       record.userId.toString(),
//       await hashPassword(newPassword)
//     );

//     await this.resetPasswordRepository.deleteByUserId(record.userId);
//     await this.refreshTokenRepository.revokeAllForUser(record.userId);
//   }

//   // ================= GOOGLE LOGIN =================
//   async googleLogin(
//     credential: string
//   ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
//     const ticket = await this.oauthClient.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });



//     const payload = ticket.getPayload();
//     if (!payload?.email) {
//       throw new UnauthorizedError("Invalid Google token");
//     }

//     let user = await this.userRepository.findByEmail(payload.email);

//     if (!user) {
//       user = await this.userRepository.create({
//         email: payload.email,
//         name: payload.name ?? payload.email.split("@")[0],
//         password: null,
//         role: "user",
//         isVerified: true,
//         provider: "google",
//       });
//     }

//     const jwtPayload = {
//       userId: user._id.toString(),
//       role: user.role,
//     };

//     const accessToken = generateAccessToken(jwtPayload);
//     const refreshToken = generateRefreshToken(jwtPayload);

//     await this.refreshTokenRepository.create({
//       userId: user._id,
//       tokenHash: hashRefreshToken(refreshToken),
//       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     });

//     return { accessToken, refreshToken, user };
//   }


//   // ================= LOGOUT =================
// async logout(refreshToken: string): Promise<void> {
//   const tokenHash = hashRefreshToken(refreshToken);
//   await this.refreshTokenRepository.deleteByTokenHash(tokenHash);
// }

// }




import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { OAuth2Client } from "google-auth-library";
import { IAuthService } from "../types/services/IAuthService";
import { IUserRepository } from "../types/repositories/IUserRepository";
import { IOtpRepository } from "../types/repositories/IOtpRepository";
import { IMailService } from "../types/services/IMailService";
import { IRefreshTokenRepository } from "../types/repositories/IRefreshTokenRepository";
import { IResetPasswordRepository } from "../types/repositories/IResetPasswordRepository";

import { UnauthorizedError, BadRequestError } from "../utils/errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { IUser } from "../models/User.model";

import { comparePasswords, hashPassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { hashRefreshToken } from "../utils/refreshTokenHash";
import {
  generateResetToken,
  hashResetToken,
} from "../utils/resetPasswordToken";
import { generateOtp } from "../utils/otp";
import { hashOtp, compareOtp } from "../utils/otpHash";

@injectable()
export class AuthService implements IAuthService {
  private readonly oauthClient: OAuth2Client;

  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.OtpRepository)
    private readonly otpRepository: IOtpRepository,

    @inject(TYPES.MailService)
    private readonly mailService: IMailService,

    @inject(TYPES.RefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(TYPES.ResetPasswordRepository)
    private readonly resetPasswordRepository: IResetPasswordRepository
  ) {
    this.oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  // ================= LOGIN =================
  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const jwtPayload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    await this.refreshTokenRepository.create({
      userId: user._id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken, user };
  }

 // ================= REFRESH (STABLE & SAFE) =================
// async refreshAccessToken(refreshToken: string) {
//   const payload = verifyRefreshToken(refreshToken);

//   const stored = await this.refreshTokenRepository.findByTokenHash(
//     hashRefreshToken(refreshToken)
//   );

//   if (!stored || stored.expiresAt < new Date()) {
//     throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
//   }

//   const user = await this.userRepository.findById(payload.userId);
//   if (!user) {
//     throw new UnauthorizedError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
//   }

//   // 🔥 revoke old token
//   await this.refreshTokenRepository.revokeToken(stored._id);

//   const newAccessToken = generateAccessToken({
//     userId: user._id.toString(),
//     role: user.role,
//   });

//   const newRefreshToken = generateRefreshToken({
//     userId: user._id.toString(),
//     role: user.role,
//   });

//   await this.refreshTokenRepository.create({
//     userId: user._id,
//     tokenHash: hashRefreshToken(newRefreshToken),
//     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//   });

//   return {
//     accessToken: newAccessToken,
//     refreshToken: newRefreshToken,
//     user,
//   };
// }


async refreshAccessToken(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  // const stored = await this.refreshTokenRepository.findOne({
  //   tokenHash: hashRefreshToken(refreshToken),
  //   isRevoked: false,
  // });

  // if (!stored || stored.expiresAt < new Date()) {
  //   throw new UnauthorizedError(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID);
  // }


const stored =
  await this.refreshTokenRepository.findValidTokenByHash(
    hashRefreshToken(refreshToken)
  );

if (!stored || stored.expiresAt < new Date()) {
  throw new UnauthorizedError(
    ERROR_MESSAGES.AUTH.REFRESH_TOKEN_INVALID
  );
}



  const user = await this.userRepository.findById(payload.userId);
  if (!user) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });

  // ❌ NO ROTATION
  return { accessToken, user };
}


  // ================= SIGNUP =================
  async signup(email: string, password: string): Promise<void> {
    const exists = await this.userRepository.findByEmail(email);
    if (exists) {
      throw new BadRequestError(ERROR_MESSAGES.AUTH.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await hashPassword(password);

    await this.userRepository.create({
      email,
      name: email.split("@")[0],
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    const otp = generateOtp();

    await this.otpRepository.create(
      email,
      await hashOtp(otp),
      new Date(Date.now() + 10 * 60 * 1000)
    );

    await this.mailService.sendOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const record = await this.otpRepository.findByEmail(email);

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }

    const valid = await compareOtp(otp, record.otpHash);
    if (!valid) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.OTP_INVALID);
    }

    await this.userRepository.verifyUser(email);
    await this.otpRepository.deleteByEmail(email);
  }

  async resendOtp(email: string): Promise<void> {
    const otp = generateOtp();

    await this.otpRepository.updateOtp(
      email,
      await hashOtp(otp),
      new Date(Date.now() + 10 * 60 * 1000)
    );

    await this.mailService.sendOtp(email, otp);
  }

  // ================= PASSWORD RESET =================
  async forgotPassword(email: string): Promise<string | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    await this.resetPasswordRepository.deleteByUserId(user._id);

    const resetToken = generateResetToken();

    await this.resetPasswordRepository.create(
      user._id,
      hashResetToken(resetToken),
      new Date(Date.now() + 15 * 60 * 1000)
    );

    return resetToken;
  }

  async sendResetPasswordEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    await this.mailService.sendResetPasswordEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const record = await this.resetPasswordRepository.findByTokenHash(
      hashResetToken(token)
    );

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestError(ERROR_MESSAGES.AUTH.RESET_TOKEN_INVALID);
    }

    await this.userRepository.updatePassword(
      record.userId.toString(),
      await hashPassword(newPassword)
    );

    await this.resetPasswordRepository.deleteByUserId(record.userId);
    await this.refreshTokenRepository.revokeAllForUser(record.userId);
  }

  // ================= GOOGLE LOGIN =================
  async googleLogin(
    credential: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new UnauthorizedError("Invalid Google token");
    }

    let user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      user = await this.userRepository.create({
        email: payload.email,
        name: payload.name ?? payload.email.split("@")[0],
        password: null,
        role: "user",
        isVerified: true,
        provider: "google",
      });
    }

    const jwtPayload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    await this.refreshTokenRepository.create({
      userId: user._id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken, user };
  }

  // ================= LOGOUT =================
  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);
    await this.refreshTokenRepository.deleteByTokenHash(tokenHash);
  }
}

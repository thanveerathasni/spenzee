export const TYPES = {
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  UserRepository: Symbol.for("UserRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
  MailService: Symbol.for("MailService"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
  ResetPasswordRepository: Symbol.for("ResetPasswordRepository"),
} as const;

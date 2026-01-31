export const TYPES = {
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  UserRepository: Symbol.for("UserRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
  MailService: Symbol.for("MailService"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
  ResetPasswordRepository: Symbol.for("ResetPasswordRepository"),

  //  ADMIN AUTH
  AdminAuthController: Symbol.for("AdminAuthController"),
  AdminAuthService: Symbol.for("AdminAuthService"),
  AdminRepository: Symbol.for("AdminRepository"),

  AdminController: Symbol.for("AdminController"),
  AdminService: Symbol.for("AdminService"),

} as const;

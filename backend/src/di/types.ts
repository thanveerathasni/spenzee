

export const TYPES = {
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  UserRepository: Symbol.for("UserRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
  MailService: Symbol.for("MailService"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
  ResetPasswordRepository: Symbol.for("ResetPasswordRepository"),

 // ===== ADMIN AUTH =====
  AdminRepository: Symbol.for("AdminRepository"),
  AdminAuthService: Symbol.for("AdminAuthService"),
  AdminAuthController: Symbol.for("AdminAuthController"),

  // ===== ADMIN CORE =====
  AdminService: Symbol.for("AdminService"),
  AdminController: Symbol.for("AdminController"),

  
} as const;

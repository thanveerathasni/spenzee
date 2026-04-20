// export const TYPES = {
//   /* ===== USER ===== */
//   AuthService: Symbol.for("AuthService"),
//   AuthController: Symbol.for("AuthController"),
//   UserService: Symbol.for("UserService"),
//   UserController: Symbol.for("UserController"),
//   UserRepository: Symbol.for("UserRepository"),

//   /* ===== COMMON ===== */
//   OtpRepository: Symbol.for("OtpRepository"),
//   OtpService: Symbol.for("OtpService"),
//   MailService: Symbol.for("MailService"),
//   RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
//   ResetPasswordRepository: Symbol.for("ResetPasswordRepository"),

//   /* ===== ADMIN ===== */
//   AdminRepository: Symbol.for("AdminRepository"),
//   AdminService: Symbol.for("AdminService"),
//   AdminController: Symbol.for("AdminController"),
//   AdminAuthService: Symbol.for("AdminAuthService"),
//   AdminAuthController: Symbol.for("AdminAuthController"),

//   /* ===== PROVIDER ===== */
//   ProviderRepository: Symbol.for("ProviderRepository"),
//   ProviderService: Symbol.for("ProviderService"),
//   ProviderController: Symbol.for("ProviderController"),

//   ProviderAuthService: Symbol.for("ProviderAuthService"),
//   ProviderAuthController: Symbol.for("ProviderAuthController"),

//   ProviderRequestRepository: Symbol.for("ProviderRequestRepository"),
//   ProviderRequestService: Symbol.for("ProviderRequestService"),

//   ProviderPasswordSetupTokenRepository: Symbol.for("ProviderPasswordSetupTokenRepository"),
//   ProviderDashboardService: Symbol.for("ProviderDashboardService"),
// } as const;




/* ================= TYPES ================= */
export const TYPES = {
  /* ===== USER ===== */
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  UserService: Symbol.for("UserService"),
  UserController: Symbol.for("UserController"),
  UserRepository: Symbol.for("UserRepository"),

  /* ===== COMMON ===== */
  OtpRepository: Symbol.for("OtpRepository"),
  OtpService: Symbol.for("OtpService"),
  MailService: Symbol.for("MailService"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
  ResetPasswordRepository: Symbol.for("ResetPasswordRepository"),

  /* ===== ADMIN ===== */
  AdminRepository: Symbol.for("AdminRepository"),
  AdminService: Symbol.for("AdminService"),
  AdminController: Symbol.for("AdminController"),
  AdminAuthService: Symbol.for("AdminAuthService"),
  AdminAuthController: Symbol.for("AdminAuthController"),

  /* ===== PROVIDER ===== */
  ProviderRepository: Symbol.for("ProviderRepository"),
  ProviderService: Symbol.for("ProviderService"),
  ProviderController: Symbol.for("ProviderController"),

  ProviderAuthService: Symbol.for("ProviderAuthService"),
  ProviderAuthController: Symbol.for("ProviderAuthController"),

  ProviderRequestRepository: Symbol.for("ProviderRequestRepository"),
  ProviderRequestService: Symbol.for("ProviderRequestService"),

  ProviderPasswordSetupTokenRepository: Symbol.for("ProviderPasswordSetupTokenRepository"),
  ProviderDashboardService: Symbol.for("ProviderDashboardService"),
} as const;
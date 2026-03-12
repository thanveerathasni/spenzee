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

  // ===== Provider Request =====
  ProviderRequestRepository: Symbol.for("ProviderRequestRepository"),
  ProviderRequestService: Symbol.for("ProviderRequestService"),
  ProviderRequestController: Symbol.for("ProviderRequestController"),
  ProviderRepository: Symbol.for("ProviderRepository"),
  ProviderService: Symbol.for("ProviderService"),
  ProviderAuthService: Symbol.for("ProviderAuthService"),
  ProviderAuthController: Symbol.for("ProviderAuthController"),
  ProviderPasswordSetupTokenRepository: Symbol.for("ProviderPasswordSetupTokenRepository"),
  ProviderDashboardService: Symbol.for("ProviderDashboardService"),
  ProviderController: Symbol.for("ProviderController"),
  ProviderCredentialService: Symbol.for("ProviderCredentialService"),
} as const;

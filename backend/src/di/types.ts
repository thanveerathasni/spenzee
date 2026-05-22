
/* ================= TYPES ================= */
export const TYPES = {
  /* ===== USER ===== */
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  UserService: Symbol.for("UserService"),
  UserController: Symbol.for("UserController"),
  UserRepository: Symbol.for("UserRepository"),
  AddressRepository: Symbol.for("AddressRepository"),
  AddressService: Symbol.for("AddressService"),
  AddressController: Symbol.for("AddressController"),
  UserVerificationRepository: Symbol.for("UserVerificationRepository"),
  UserVerificationService: Symbol.for("UserVerificationService"),
  UserVerificationController: Symbol.for("UserVerificationController"),
  BankStatementRepository: Symbol.for("BankStatementRepository"),
  BankTransactionRepository: Symbol.for("BankTransactionRepository"),
  FinancialInsightRepository: Symbol.for("FinancialInsightRepository"),
  BankStatementService: Symbol.for("BankStatementService"),
  BankStatementController: Symbol.for("BankStatementController"),

  /* ===== COMMON ===== */
  OtpRepository: Symbol.for("OtpRepository"),
  OtpService: Symbol.for("OtpService"),
  OtpController: Symbol.for("OtpController"),
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
  ProviderVerificationRepository: Symbol.for("ProviderVerificationRepository"),
  ProviderVerificationService: Symbol.for("ProviderVerificationService"),
  ProviderVerificationController: Symbol.for("ProviderVerificationController"),

  ProviderAuthService: Symbol.for("ProviderAuthService"),
  ProviderAuthController: Symbol.for("ProviderAuthController"),

  ProviderRequestRepository: Symbol.for("ProviderRequestRepository"),
  ProviderRequestService: Symbol.for("ProviderRequestService"),
  ProviderRequestController: Symbol.for("ProviderRequestController"),

  ProviderPasswordSetupTokenRepository: Symbol.for("ProviderPasswordSetupTokenRepository"),
  ProviderDashboardService: Symbol.for("ProviderDashboardService"),

  VerificationAdminController: Symbol.for("VerificationAdminController"),
  FinancialMonitoringController: Symbol.for("FinancialMonitoringController"),
  NotificationController: Symbol.for("NotificationController"),
  NotificationRepository: Symbol.for("NotificationRepository"),
  NotificationService: Symbol.for("NotificationService"),
  DocumentUploadService: Symbol.for("DocumentUploadService"),
} as const;

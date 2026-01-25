export const TYPES = {
  // Controllers
  AuthController: Symbol.for("AuthController"),

  // Services
  AuthService: Symbol.for("AuthService"),

  // Repositories
  UserRepository: Symbol.for("UserRepository"),

    
  OtpRepository: Symbol.for("OtpRepository"),

  MailService: Symbol.for("MailService"),



} as const;

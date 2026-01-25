export const TYPES = {
  // Controllers
  AuthController: Symbol.for("AuthController"),

  // Services
  AuthService: Symbol.for("AuthService"),

  // Repositories
  UserRepository: Symbol.for("UserRepository")
} as const;

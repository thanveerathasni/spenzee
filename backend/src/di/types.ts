export const TYPES = {
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  UserRepository: Symbol.for("UserRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
  MailService: Symbol.for("MailService"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
  ResetPasswordRepository: Symbol.for("ResetPasswordRepository"),
  ProductRepository: Symbol.for("ProductRepository"),
  ProductService: Symbol.for("ProductService"),
  ProductImageService: Symbol.for("ProductImageService"),
  ProductController: Symbol.for("ProductController"),
} as const;

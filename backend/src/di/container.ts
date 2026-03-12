import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

// ===== USER =====

import { IMailService } from "../types/services/IMailService";
import { IRefreshTokenRepository } from "../types/repositories/IRefreshTokenRepository";
import { IResetPasswordRepository } from "../types/repositories/IResetPasswordRepository";

// ===== ADMIN =====
import { AdminRepository } from "../repositories/admin/AdminRepository";
import { AdminAuthService } from "../services/admin/AdminAuthService";
import { AdminAuthController } from "../controllers/admin/AdminAuthController";
import { AdminController } from "../controllers/admin/AdminController";
import { AdminService } from "../services/admin/AdminService";

import { IAdminRepository } from "../types/repositories/admin/IAdminRepository";
import { IAdminAuthService } from "../types/services/admin/IAdminAuthService";
import { IAdminService } from "../types/services/admin/IAdminService";

// ===== PROVIDER =====
import { ProviderRequestRepository } from "../repositories/provider/auth/ProviderRequestRepository";
import { ProviderRequestService } from "../services/provider/auth/ProviderRequestService";
import { ProviderRequestController } from "../controllers/provider/auth/ProviderRequestController";
import { ProviderRepository } from "../repositories/provider/auth/ProviderRepository";
import { ProviderService } from "../services/provider/ProviderService";
import { ProviderAuthService } from "../services/provider/auth/ProviderAuthService";
import { ProviderAuthController } from "../controllers/provider/auth/ProviderAuthController";
import { ProviderPasswordSetupTokenRepository } from "../repositories/provider/auth/ProviderPasswordSetupTokenRepository";
import { ProviderController } from "../controllers/provider/ProviderController";
import { AuthController } from "../controllers/user/AuthController";
import { OtpRepository } from "../repositories/OtpRepository";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository";
import { ResetPasswordRepository } from "../repositories/ResetPasswordRepository";
import { UserRepository } from "../repositories/user/UserRepository";
import { MailService } from "../services/MailService";
import { ProviderCredentialService } from "../services/provider/auth/ProviderCredentialService";
import { AuthService } from "../services/user/AuthService";
import { IOtpRepository } from "../types/repositories/IOtpRepository";

import { IProviderPasswordSetupTokenRepository } from "../types/repositories/provider/IProviderPasswordSetupTokenRepository";
import { IProviderRepository } from "../types/repositories/provider/IProviderRepository";
import { IProviderRequestRepository } from "../types/repositories/provider/IProviderRequestRepository";
import { IUserRepository } from "../types/repositories/user/IUserRepository";
import { IProviderRequestService } from "../types/services/provider/IProviderRequestService";
import { IProviderService } from "../types/services/provider/IProviderService";
import { IAuthService } from "../types/services/user/IAuthService";

const container = new Container();

// USER
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<IMailService>(TYPES.MailService).to(MailService);
container.bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository).to(RefreshTokenRepository);
container.bind<IResetPasswordRepository>(TYPES.ResetPasswordRepository).to(ResetPasswordRepository);

// ADMIN
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository).inSingletonScope();
container.bind<IAdminAuthService>(TYPES.AdminAuthService).to(AdminAuthService).inSingletonScope();
container.bind<IAdminService>(TYPES.AdminService).to(AdminService).inSingletonScope();
container.bind<AdminAuthController>(TYPES.AdminAuthController).to(AdminAuthController);
container.bind<AdminController>(TYPES.AdminController).to(AdminController);

// PROVIDER
container
  .bind<IProviderRequestRepository>(TYPES.ProviderRequestRepository)
  .to(ProviderRequestRepository);
container.bind<IProviderRequestService>(TYPES.ProviderRequestService).to(ProviderRequestService);
container
  .bind<ProviderRequestController>(TYPES.ProviderRequestController)
  .to(ProviderRequestController);
container.bind<IProviderRepository>(TYPES.ProviderRepository).to(ProviderRepository);
container.bind<IProviderService>(TYPES.ProviderService).to(ProviderService);
container.bind<ProviderAuthService>(TYPES.ProviderAuthService).to(ProviderAuthService);
container.bind<ProviderAuthController>(TYPES.ProviderAuthController).to(ProviderAuthController);
container
  .bind<IProviderPasswordSetupTokenRepository>(TYPES.ProviderPasswordSetupTokenRepository)
  .to(ProviderPasswordSetupTokenRepository);
container.bind<ProviderController>(TYPES.ProviderController).to(ProviderController);
container
  .bind<ProviderCredentialService>(TYPES.ProviderCredentialService)
  .to(ProviderCredentialService);

export { container };

import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

/* Repositories */
import { AdminAuthController } from "../controllers/admin/AdminAuthController";
import { AdminController } from "../controllers/admin/AdminController";
import { ProviderController } from "../controllers/provider/ProviderController";
import { ProviderAuthController } from "../controllers/provider/auth/ProviderAuthController";
import { ProviderRequestController } from "../controllers/provider/auth/ProviderRequestController";
import { AuthController } from "../controllers/user/AuthController";
import { UserController } from "../controllers/user/UserController"; 
import { OtpRepository } from "../repositories/OtpRepository";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository";
import { ResetPasswordRepository } from "../repositories/ResetPasswordRepository";
import { AdminRepository } from "../repositories/admin/AdminRepository";
import { ProviderPasswordSetupTokenRepository } from "../repositories/provider/auth/ProviderPasswordSetupTokenRepository";
import { ProviderRepository } from "../repositories/provider/auth/ProviderRepository";
import { ProviderRequestRepository } from "../repositories/provider/auth/ProviderRequestRepository";
import { UserRepository } from "../repositories/user/UserRepository";

/* Services */
import { MailService } from "../services/MailService";
import { AdminAuthService } from "../services/admin/AdminAuthService";
import { AdminService } from "../services/admin/AdminService";
import { OtpService } from "../services/otp.service";
import { ProviderDashboardService } from "../services/provider/ProviderDashboardService";
import { ProviderService } from "../services/provider/ProviderService";
import { ProviderAuthService } from "../services/provider/auth/ProviderAuthService";
import { ProviderCredentialService } from "../services/provider/auth/ProviderCredentialService"; 
import { ProviderRequestService } from "../services/provider/auth/ProviderRequestService";
import { AuthService } from "../services/user/AuthService";
import { UserService } from "../services/user/UserService"; 

/* Controllers */



const container = new Container();

/* ================= REPOSITORIES ================= */
container.bind(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.ProviderRepository).to(ProviderRepository);
container.bind(TYPES.ProviderRequestRepository).to(ProviderRequestRepository);
container.bind(TYPES.ProviderPasswordSetupTokenRepository).to(ProviderPasswordSetupTokenRepository);
container.bind(TYPES.RefreshTokenRepository).to(RefreshTokenRepository);
container.bind(TYPES.ResetPasswordRepository).to(ResetPasswordRepository);
container.bind(TYPES.OtpRepository).to(OtpRepository);
container.bind(TYPES.AdminRepository).to(AdminRepository);

/* ================= SERVICES ================= */
container.bind(TYPES.AuthService).to(AuthService);
container.bind(TYPES.ProviderService).to(ProviderService);
container.bind(TYPES.ProviderRequestService).to(ProviderRequestService);
container.bind(TYPES.ProviderAuthService).to(ProviderAuthService);
container.bind(TYPES.ProviderDashboardService).to(ProviderDashboardService);
container.bind(TYPES.AdminService).to(AdminService);
container.bind(TYPES.AdminAuthService).to(AdminAuthService);
container.bind(TYPES.MailService).to(MailService);
container.bind(TYPES.UserService).to(UserService); 
container.bind(TYPES.ProviderCredentialService).to(ProviderCredentialService); 

/* ================= CONTROLLERS ================= */
container.bind(TYPES.AuthController).to(AuthController);
container.bind(TYPES.ProviderController).to(ProviderController);
container.bind(TYPES.ProviderAuthController).to(ProviderAuthController);
container.bind(TYPES.ProviderRequestController).to(ProviderRequestController);
container.bind(TYPES.AdminController).to(AdminController);
container.bind(TYPES.AdminAuthController).to(AdminAuthController);
container.bind(TYPES.UserController).to(UserController); 


container.bind(TYPES.OtpService).to(OtpService);

export { container };
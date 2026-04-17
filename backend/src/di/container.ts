import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

/* ================= CONTROLLERS ================= */
import { AdminAuthController } from "../controllers/admin/AdminAuthController";
import { AdminController } from "../controllers/admin/AdminController";
import { ProviderController } from "../controllers/provider/ProviderController";
import { ProviderAuthController } from "../controllers/provider/auth/ProviderAuthController";
import { AuthController } from "../controllers/user/AuthController";
import { UserController } from "../controllers/user/UserController";

/* ================= REPOSITORIES ================= */
import { OtpRepository } from "../repositories/OtpRepository";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository";
import { ResetPasswordRepository } from "../repositories/ResetPasswordRepository";
import { AdminRepository } from "../repositories/admin/AdminRepository";
import { ProviderPasswordSetupTokenRepository } from "../repositories/provider/auth/ProviderPasswordSetupTokenRepository";
import { ProviderRepository } from "../repositories/provider/auth/ProviderRepository";
import { ProviderRequestRepository } from "../repositories/provider/auth/ProviderRequestRepository";
import { UserRepository } from "../repositories/user/UserRepository";

/* ================= SERVICES ================= */
import { MailService } from "../services/MailService";
import { AdminAuthService } from "../services/admin/AdminAuthService";
import { AdminService } from "../services/admin/AdminService";
import { OtpService } from "../services/otp.service";
import { ProviderDashboardService } from "../services/provider/ProviderDashboardService";
import { ProviderService } from "../services/provider/ProviderService";
import { ProviderAuthService } from "../services/provider/auth/ProviderAuthService";
import { ProviderRequestService } from "../services/provider/auth/ProviderRequestService";
import { AuthService } from "../services/user/AuthService";
import { UserService } from "../services/user/UserService";

const container = new Container();

/* ================= REPOSITORIES ================= */
container.bind(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.ProviderRepository).to(ProviderRepository);
container.bind(TYPES.ProviderRequestRepository).to(ProviderRequestRepository);
container.bind(TYPES.ProviderPasswordSetupTokenRepository).to(ProviderPasswordSetupTokenRepository);
container.bind(TYPES.AdminRepository).to(AdminRepository);
container.bind(TYPES.OtpRepository).to(OtpRepository);
container.bind(TYPES.RefreshTokenRepository).to(RefreshTokenRepository);
container.bind(TYPES.ResetPasswordRepository).to(ResetPasswordRepository);

/* ================= SERVICES ================= */
container.bind(TYPES.AuthService).to(AuthService);
container.bind(TYPES.UserService).to(UserService);

container.bind(TYPES.ProviderService).to(ProviderService);
container.bind(TYPES.ProviderAuthService).to(ProviderAuthService);
container.bind(TYPES.ProviderRequestService).to(ProviderRequestService);
container.bind(TYPES.ProviderDashboardService).to(ProviderDashboardService);

container.bind(TYPES.AdminService).to(AdminService);
container.bind(TYPES.AdminAuthService).to(AdminAuthService);

container.bind(TYPES.MailService).to(MailService);
container.bind(TYPES.OtpService).to(OtpService);

/* ================= CONTROLLERS ================= */
container.bind(TYPES.AuthController).to(AuthController);
container.bind(TYPES.UserController).to(UserController);

container.bind(TYPES.ProviderController).to(ProviderController);
container.bind(TYPES.ProviderAuthController).to(ProviderAuthController);

container.bind(TYPES.AdminController).to(AdminController);
container.bind(TYPES.AdminAuthController).to(AdminAuthController);

export { container };
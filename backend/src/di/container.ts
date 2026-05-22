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
import { AddressController } from "../controllers/user/AddressController";
import { ProviderRequestController } from "../controllers/provider/auth/ProviderRequestController";
import { UserVerificationController } from "../controllers/user/UserVerificationController";
import { ProviderVerificationController } from "../controllers/provider/ProviderVerificationController";
import { VerificationAdminController } from "../controllers/admin/VerificationAdminController";
import { NotificationController } from "../controllers/notification/NotificationController";
import { OtpController } from "../controllers/otp.controller";
import { BankStatementController } from "../controllers/user/BankStatementController";
import { FinancialMonitoringController } from "../controllers/admin/FinancialMonitoringController";

/* ================= REPOSITORIES ================= */
import { OtpRepository } from "../repositories/OtpRepository";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository";
import { ResetPasswordRepository } from "../repositories/ResetPasswordRepository";
import { AdminRepository } from "../repositories/admin/AdminRepository";
import { ProviderPasswordSetupTokenRepository } from "../repositories/provider/auth/ProviderPasswordSetupTokenRepository";
import { ProviderRepository } from "../repositories/provider/auth/ProviderRepository";
import { ProviderRequestRepository } from "../repositories/provider/auth/ProviderRequestRepository";
import { UserRepository } from "../repositories/user/UserRepository";
import { AddressRepository } from "../repositories/user/AddressRepository";
import { UserVerificationRepository } from "../repositories/verification/UserVerificationRepository";
import { ProviderVerificationRepository } from "../repositories/verification/ProviderVerificationRepository";
import { NotificationRepository } from "../repositories/notification/NotificationRepository";
import { BankStatementRepository } from "../repositories/financial/BankStatementRepository";
import { BankTransactionRepository } from "../repositories/financial/BankTransactionRepository";
import { FinancialInsightRepository } from "../repositories/financial/FinancialInsightRepository";

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
import { AddressService } from "../services/user/AddressService";
import { UserVerificationService } from "../services/verification/UserVerificationService";
import { ProviderVerificationService } from "../services/verification/ProviderVerificationService";
import { NotificationService } from "../services/notification/NotificationService";
import { DocumentUploadService } from "../services/upload/DocumentUploadService";
import { BankStatementService } from "../services/financial/BankStatementService";

/* ================= CONTAINER ================= */
const container = new Container();

/* ================= REPOSITORIES ================= */
container.bind(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.AddressRepository).to(AddressRepository);
container.bind(TYPES.UserVerificationRepository).to(UserVerificationRepository);
container.bind(TYPES.ProviderVerificationRepository).to(ProviderVerificationRepository);
container.bind(TYPES.NotificationRepository).to(NotificationRepository);
container.bind(TYPES.BankStatementRepository).to(BankStatementRepository);
container.bind(TYPES.BankTransactionRepository).to(BankTransactionRepository);
container.bind(TYPES.FinancialInsightRepository).to(FinancialInsightRepository);
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
container.bind(TYPES.AddressService).to(AddressService);
container.bind(TYPES.UserVerificationService).to(UserVerificationService);
container.bind(TYPES.ProviderVerificationService).to(ProviderVerificationService);
container.bind(TYPES.NotificationService).to(NotificationService);
container.bind(TYPES.DocumentUploadService).to(DocumentUploadService);
container.bind(TYPES.BankStatementService).to(BankStatementService);

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
container.bind(TYPES.AddressController).to(AddressController);
container.bind(TYPES.UserVerificationController).to(UserVerificationController);
container.bind(TYPES.BankStatementController).to(BankStatementController);

container.bind(TYPES.ProviderController).to(ProviderController);
container.bind(TYPES.ProviderAuthController).to(ProviderAuthController);
container.bind(TYPES.ProviderRequestController).to(ProviderRequestController);
container.bind(TYPES.ProviderVerificationController).to(ProviderVerificationController);
container
  .bind(TYPES.OtpController)
  .to(OtpController);
container.bind(TYPES.AdminController).to(AdminController);
container.bind(TYPES.AdminAuthController).to(AdminAuthController);
container.bind(TYPES.VerificationAdminController).to(VerificationAdminController);
container.bind(TYPES.FinancialMonitoringController).to(FinancialMonitoringController);
container.bind(TYPES.NotificationController).to(NotificationController);

export { container };

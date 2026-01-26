import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";

import { IAuthService } from "../types/services/IAuthService";
import { IUserRepository } from "../types/repositories/IUserRepository";
import { OtpRepository } from "../repositories/OtpRepository";
import { IOtpRepository } from "../types/repositories/IOtpRepository";
import { IMailService } from "../types/services/IMailService";
import { MailService } from "../services/MailService";
import { IRefreshTokenRepository } from "../types/repositories/IRefreshTokenRepository";
import { RefreshTokenRepository } from "../repositories/RefreshTokenRepository";
import { IResetPasswordRepository } from "../types/repositories/IResetPasswordRepository";
import { ResetPasswordRepository } from "../repositories/ResetPasswordRepository";

// Repositories


const container = new Container();

// Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

container.bind<IOtpRepository>(TYPES.OtpRepository)
  .to(OtpRepository);

  container
  .bind<IMailService>(TYPES.MailService)
  .to(MailService);

  container
  .bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository)
  .to(RefreshTokenRepository);


  container
  .bind<IResetPasswordRepository>(TYPES.ResetPasswordRepository)
  .to(ResetPasswordRepository);



export { container };

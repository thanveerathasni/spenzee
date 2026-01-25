import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";

import { IAuthService } from "../types/services/IAuthService";
import { IUserRepository } from "../types/repositories/IUserRepository";

const container = new Container();

// Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

export { container };

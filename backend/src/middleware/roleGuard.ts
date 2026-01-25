import { Response, NextFunction } from "express";
import { Role } from "../constants/roles";
import { AuthRequest } from "./authGuard";
import { UnauthorizedError } from "../utils/errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const roleGuard =
  (allowedRoles: Role[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.ACCESS_DENIED
      );
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.ACCESS_DENIED
      );
    }

    next();
  };

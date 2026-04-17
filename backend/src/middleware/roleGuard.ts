import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
import { Role } from "../shared/constants/roles";
import { UnauthorizedError } from "../shared/errors/errors";

export const roleGuard =
  (allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED));
    }

    next();
  };
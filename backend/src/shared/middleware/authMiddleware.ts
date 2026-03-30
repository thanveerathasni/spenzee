import { Request, Response, NextFunction } from "express";

import { ERROR_MESSAGES } from "../constants/errorMessages";
import { Role } from "../constants/roles";
import { UnauthorizedError } from "../errors/errors";

import { verifyAccessToken } from "../utils/token.util";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

export const protect = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch (_error) {
    next(new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS));
  }
};

export const authorize =
  (allowedRoles: Role[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS));
      return;
    }

    next();
  };
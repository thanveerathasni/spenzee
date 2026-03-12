import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../shared/errors/errors";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
import { AuthRequest } from "../types/services/user/AuthRequest";
import { isValidRole } from "../shared/utils/roleUtils";
import { Role } from "../shared/constants/roles";

export const authGuard = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const ACCESS_DENIED = ERROR_MESSAGES.AUTH.ACCESS_DENIED;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError(ACCESS_DENIED);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as { userId: string; role: unknown };

    if (!isValidRole(payload.role)) {
      throw new UnauthorizedError(ACCESS_DENIED);
    }

    req.user = {
      id: payload.userId,
      role: payload.role as Role
    };

    next();
  } catch {
    throw new UnauthorizedError(ACCESS_DENIED);
  }
};
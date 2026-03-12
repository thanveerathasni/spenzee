import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../shared/errors/errors";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
import { AuthRequest } from "../types/services/user/AuthRequest";
import { ROLES } from "../shared/constants/roles";

interface ProviderJwtPayload {
  providerId: string;
  role: string;
}

export const authenticateProvider = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_PROVIDER_SECRET as string,
    ) as ProviderJwtPayload;

    if (payload.role !== ROLES.PROVIDER) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    req.provider = {
      id: payload.providerId,
      role: payload.role,
    };

    next();
  } catch {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }
};

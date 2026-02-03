import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";
import { ROLES } from "../constants/roles";
import { ProviderRequest } from "../types/ProviderRequest";

interface ProviderJwtPayload {
  providerId: string;
  role: string;
}

export const authenticateProvider = (
  req: ProviderRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Provider access denied");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_PROVIDER_SECRET as string
    ) as ProviderJwtPayload;

    if (payload.role !== ROLES.PROVIDER) {
      throw new UnauthorizedError("Provider access denied");
    }

    req.provider = {
      id: payload.providerId,
      role: payload.role,
    };

    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired provider token");
  }
};

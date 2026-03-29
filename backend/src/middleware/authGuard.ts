import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
import { Role } from "../shared/constants/roles";
import { UnauthorizedError } from "../shared/errors/errors";
import { verifyAccessToken } from "../shared/utils/token.util";

export const authGuard = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      role: payload.role as Role,
    };

    next();
  } catch {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }
};
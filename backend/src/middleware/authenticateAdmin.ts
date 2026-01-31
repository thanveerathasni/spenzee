import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { UnauthorizedError } from "../utils/errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { ROLES } from "../constants/roles";
import { AuthRequest } from "../types/AuthRequest";

interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError(
      ERROR_MESSAGES.AUTH.ACCESS_DENIED
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as JwtPayload;

    if (payload.role !== ROLES.ADMIN) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH.ACCESS_DENIED
      );
    }

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch {
    throw new UnauthorizedError(
      ERROR_MESSAGES.AUTH.ACCESS_DENIED
    );
  }
};

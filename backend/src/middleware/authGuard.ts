import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authGuard = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError(
      ERROR_MESSAGES.AUTH.ACCESS_DENIED
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as { userId: string; role: string };

    req.user = payload;
    next();
  } catch {
    throw new UnauthorizedError(
      ERROR_MESSAGES.AUTH.ACCESS_DENIED
    );
  }
};

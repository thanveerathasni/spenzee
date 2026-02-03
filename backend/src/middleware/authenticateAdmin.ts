import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";
import { ROLES } from "../constants/roles";

interface AdminJwtPayload {
  adminId: string;
  role: string;
}

export const authenticateAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Admin access denied");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ADMIN_SECRET as string
    ) as AdminJwtPayload;

    if (payload.role !== ROLES.ADMIN) {
      throw new UnauthorizedError("Admin access denied");
    }

    // attach admin safely
    (req as any).admin = {
      id: payload.adminId,
      role: payload.role,
    };

    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired admin token");
  }
};

import { Request, Response, NextFunction } from "express";
import { Role, ROLES } from "../constants/roles";
import { UnauthorizedError } from "../utils/errors";


export const requireRole =
  (allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Not authenticated");
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      throw new UnauthorizedError("Access denied");
    }

    next();
  };

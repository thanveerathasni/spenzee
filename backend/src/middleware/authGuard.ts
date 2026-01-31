// import { Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { UnauthorizedError } from "../utils/errors";
// import { ERROR_MESSAGES } from "../constants/errorMessages";
// import { AuthRequest } from "../types/AuthRequest";
// import { isValidRole } from "../utils/roleUtils";

// export const authGuard = (
//   req: AuthRequest,
//   _res: Response,
//   next: NextFunction
// ): void => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader?.startsWith("Bearer ")) {
//     throw new UnauthorizedError(
//       ERROR_MESSAGES.AUTH.ACCESS_DENIED
//     );
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const payload = jwt.verify(
//       token,
//       process.env.JWT_ACCESS_SECRET as string
//     ) as { userId: string; role: unknown };

//     if (!isValidRole(payload.role)) {
//       throw new UnauthorizedError(
//         ERROR_MESSAGES.AUTH.ACCESS_DENIED
//       );
//     }

//     req.user = {
//       id: payload.userId,
//       role: payload.role
//     };

//     next();
//   } catch {
//     throw new UnauthorizedError(
//       ERROR_MESSAGES.AUTH.ACCESS_DENIED
//     );
//   }
// };









import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { AuthRequest } from "../types/AuthRequest";
import { isValidRole } from "../utils/roleUtils";
import { Role } from "../constants/roles";

export const authGuard = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as { userId: string; role: unknown };

    if (!isValidRole(payload.role)) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    req.user = {
      id: payload.userId,
      role: payload.role as Role
    };

    next();
  } catch {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }
};

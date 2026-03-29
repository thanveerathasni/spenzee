// import { Request, Response, NextFunction } from "express";
// import { Role } from "../constants/roles";
// import { UnauthorizedError } from "../errors/errors";
// import { verifyAccessToken } from "../utils/token.util";

// export interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     role: Role;
//   };
// }

// export const protect = (req: AuthRequest, _res: Response, next: NextFunction): void => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     next(new UnauthorizedError("Not authenticated"));
//     return;
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const payload = verifyAccessToken(token);

//     req.user = {
//       id: payload.userId,
//       role: payload.role,
//     };

//     next();
//     return;
//   } catch (error) {
//     next(new UnauthorizedError("Invalid token"));
//     return;
//   }
// };

// export const authorize =
//   (allowedRoles: Role[]) =>
//   (req: AuthRequest, _res: Response, next: NextFunction): void => {
//     if (!req.user) {
//       next(new UnauthorizedError("Not authenticated"));
//       return;
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//       next(new UnauthorizedError("Access denied"));
//       return;
//     }

//     next();
//     return;
//   };

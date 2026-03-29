// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
// import { ROLES } from "../shared/constants/roles";
// import { UnauthorizedError } from "../shared/errors/errors";

// export const authenticateAdmin = (req: Request, _res: Response, next: NextFunction): void => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader?.startsWith("Bearer ")) {
//     throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const payload = jwt.verify(token, process.env.JWT_ADMIN_SECRET as string) as {
//       adminId: string;
//       role: string;
//     };

//     if (payload.role !== ROLES.ADMIN) {
//       throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
//     }

//     req.admin = {
//       id: payload.adminId,
//       role: payload.role,
//     };

//     next();
//   } catch {
//     throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
//   }
// };
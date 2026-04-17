import { Request, Response, NextFunction } from "express";
import { AdminModel } from "../models/Admin.model"; 
import { ProviderModel, ProviderStatus } from "../models/Provider.model";
import { UserModel } from "../models/User.model";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
import { Role } from "../shared/constants/roles";
import { UnauthorizedError } from "../shared/errors/errors";
import { verifyAccessToken } from "../shared/utils/token.util";


export const authGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);

    /*  HANDLE PROVIDER */
    if (payload.role === "provider") {
      const provider = await ProviderModel.findById(payload.userId);

      if (
        !provider ||
        provider.status === ProviderStatus.SUSPENDED ||
        provider.status === ProviderStatus.BLOCKED ||
        provider.status === ProviderStatus.REJECTED
      ) {
        return next(
          new UnauthorizedError("Access Denied: Account not active")
        );
      }
    }

    /*  HANDLE ADMIN */
    else if (payload.role === "admin") {
      const admin = await AdminModel.findById(payload.userId);

      if (!admin || admin.isActive === false) {
        return next(
          new UnauthorizedError("Access Denied: Admin blocked")
        );
      }
    }
    

    /*  HANDLE USER */
    else {
      const user = await UserModel.findById(payload.userId);

      if (!user || user.isActive === false) {
        return next(
          new UnauthorizedError("Access Denied: Account blocked")
        );
      }
    }

    req.user = {
      id: payload.userId,
      role: payload.role as Role,
    };
console.log("PAYLOAD:", payload);
console.log("TOKEN HEADER:", req.headers.authorization);
    next();
  } catch {
    next(new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED));
  }
};
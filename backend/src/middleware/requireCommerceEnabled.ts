import { Response, NextFunction } from "express";
import { COMMERCE_STATUS } from "../constants/commerce";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { ROLES } from "../constants/roles";
import { UserModel } from "../models/User.model";
import { AuthRequest } from "../types/AuthRequest";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";

export const requireCommerceEnabled = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const providerId = req.user?.id;

    if (!providerId || req.user?.role !== ROLES.PROVIDER) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    const provider = await UserModel.findById(providerId).exec();

    if (!provider) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    if (provider.commerceStatus === COMMERCE_STATUS.REJECTED) {
      throw new ForbiddenError(ERROR_MESSAGES.PROVIDER_COMMERCE.REJECTED);
    }

    if (
      provider.commerceStatus === COMMERCE_STATUS.FROZEN ||
      provider.isCommerceFrozen
    ) {
      throw new ForbiddenError(ERROR_MESSAGES.PROVIDER_COMMERCE.FROZEN);
    }

    if (
      provider.commerceStatus !== COMMERCE_STATUS.APPROVED ||
      !provider.commerceEnabled
    ) {
      throw new ForbiddenError(ERROR_MESSAGES.PROVIDER_COMMERCE.PENDING);
    }

    next();
  } catch (error) {
    next(error);
  }
};

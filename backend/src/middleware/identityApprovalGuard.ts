import { NextFunction, Request, Response } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { UserVerificationService } from "../services/verification/UserVerificationService";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
import { LOG_MESSAGES } from "../shared/constants/logMessages";
import { UnauthorizedError } from "../shared/errors/errors";
import { logger } from "../shared/logger/logger";

const userVerificationService = container.get<UserVerificationService>(
  TYPES.UserVerificationService,
);

export const identityApprovalGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }

  const allowed = await userVerificationService.canUploadBankStatement(userId);

  if (!allowed) {
    logger.warn(LOG_MESSAGES.USER.BANK_UPLOAD_BLOCKED, { userId });
    throw new UnauthorizedError(ERROR_MESSAGES.VERIFICATION.IDENTITY_APPROVAL_REQUIRED);
  }

  next();
};

import { Request, Response, NextFunction } from "express";

import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
import { HTTP_STATUS } from "../shared/constants/httpStatus";

import { LOG_MESSAGES } from "../shared/constants/logMessages";
import { AppError } from "../shared/errors/AppError";
import { logger } from "../shared/logger/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    logger.warn(err.message);

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

logger.error(LOG_MESSAGES.SYSTEM.ERROR_OCCURRED, {
  message: err.message,
  stack: err.stack,
});
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR,
  });
};
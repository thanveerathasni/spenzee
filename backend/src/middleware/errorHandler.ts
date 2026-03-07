import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
import { HTTP_STATUS } from "../shared/constants/httpStatus";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  console.error("Unhandled error:", err);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR
  });
};
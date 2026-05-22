




import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  ZodError,
} from "zod";

import {
  ERROR_MESSAGES,
} from "../shared/constants/errorMessages";

import {
  HTTP_STATUS,
} from "../shared/constants/httpStatus";

import {
  LOG_MESSAGES,
} from "../shared/constants/logMessages";

import { AppError } from "../shared/errors/AppError";

import { logger } from "../shared/logger/logger";

interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: string[];
  stack?: string;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response<ErrorResponse> => {
  /* ====================================================== */
  /* CUSTOM APP ERRORS */
  /* ====================================================== */

  if (err instanceof AppError) {
    logger.warn(
      err.message,
      {
        stack: err.stack,
      },
    );

    return res.status(
      err.statusCode,
    ).json({
      success: false,
      message: err.message,
      stack:
        process.env.NODE_ENV ===
        "development"
          ? err.stack
          : undefined,
    });
  }

  /* ====================================================== */
  /* ZOD VALIDATION */
  /* ====================================================== */

  if (err instanceof ZodError) {
    const errors =
      err.issues.map(
        (issue) =>
          issue.message,
      );

    logger.warn(
      ERROR_MESSAGES.GENERAL
        .VALIDATION_ERROR,
      {
        errors,
      },
    );

    return res.status(
      HTTP_STATUS.BAD_REQUEST,
    ).json({
      success: false,
      message:
        ERROR_MESSAGES.GENERAL
          .VALIDATION_ERROR,
      errors,
      stack:
        process.env.NODE_ENV ===
        "development"
          ? err.stack
          : undefined,
    });
  }

  /* ====================================================== */
  /* UNKNOWN ERRORS */
  /* ====================================================== */

  logger.error(
    LOG_MESSAGES.SYSTEM
      .ERROR_OCCURRED,
    {
      message: err.message,
      stack: err.stack,
    },
  );

  return res.status(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ).json({
    success: false,
    message:
      ERROR_MESSAGES.GENERAL
        .INTERNAL_SERVER_ERROR,
    stack:
      process.env.NODE_ENV ===
      "development"
        ? err.stack
        : undefined,
  });
};
















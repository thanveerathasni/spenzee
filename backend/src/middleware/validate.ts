import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  ZodType,
  ZodError,
} from "zod";

import {
  ERROR_MESSAGES,
} from "../shared/constants/errorMessages";

import {
  BadRequestError,
} from "../shared/errors/errors";

interface ValidatedRequestData {
  body?: Request["body"];

  params?: Request["params"];
}

export const validate =
  (
    schema: ZodType,
  ) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    try {
      const parsedData =
        schema.parse({
          body: req.body,

          query: req.query,

          params: req.params,
        }) as ValidatedRequestData;

      /* ====================================================== */
      /* SAFE MUTATIONS */
      /* ====================================================== */

      req.body =
        parsedData.body ??
        req.body;

      req.params =
        parsedData.params ??
        req.params;

      /*
        IMPORTANT:
        DO NOT mutate req.query
        Express/router newer versions
        expose query as getter-only.
      */

      next();
    } catch (
      error: unknown
    ) {
      if (
        error instanceof
        ZodError
      ) {
        const validationErrors =
          error.issues.map(
            (
              issue,
            ) =>
              issue.message,
          );

        next(
          new BadRequestError(
            validationErrors.join(
              ", ",
            ) ||
              ERROR_MESSAGES
                .GENERAL
                .VALIDATION_ERROR,
          ),
        );

        return;
      }

      next(error);
    }
  };

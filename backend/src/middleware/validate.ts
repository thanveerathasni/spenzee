import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../shared/errors/errors";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {

    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      throw new BadRequestError(
        ERROR_MESSAGES.GENERAL.VALIDATION_ERROR
      );
    }

    next();
  };
import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch {
      throw new BadRequestError(
        ERROR_MESSAGES.GENERAL.INVALID_REQUEST
      );
    }
  };

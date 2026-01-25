import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/errors";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.errors
        .map(err => err.message)
        .join(", ");

      throw new BadRequestError(message);
    }

    req.body = result.data; // sanitized & typed
    next();
  };

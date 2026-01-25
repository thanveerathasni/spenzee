import { AppError } from "./AppError";
import { HTTP_STATUS } from "../constants/httpStatus";

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

import rateLimit from "express-rate-limit";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: ERROR_MESSAGES.AUTH.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
});

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: ERROR_MESSAGES.AUTH.TOO_MANY_REQUESTS,
});

export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: ERROR_MESSAGES.AUTH.TOO_MANY_REQUESTS,
});

import { Router } from "express";
import { AuthController } from "../../controllers/user/AuthController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import {loginLimiter,otpLimiter,passwordResetLimiter,} from "../../middleware/rateLimit";
import { validate } from "../../middleware/validate";
import { forgotPasswordSchema } from "../../validators/auth/forgotPassword.validator";
import { loginSchema } from "../../validators/auth/login.validator";
import { resendOtpSchema } from "../../validators/auth/resendOtp.validator";
import { resetPasswordSchema } from "../../validators/auth/resetPassword.validator";
import { signupSchema } from "../../validators/auth/signup.validator";
import { verifyOtpSchema } from "../../validators/auth/verifyOtp.validator";
import { asyncHandler } from "../../shared/middleware/asyncHandler";

const router = Router();

const authController = container.get<AuthController>(TYPES.AuthController);

/* =====================================================
   USER AUTH ROUTES
===================================================== */

// LOGIN
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  asyncHandler(authController.login.bind(authController))
);

// REFRESH TOKEN
router.post(
  "/refresh",
  asyncHandler(authController.refresh.bind(authController))
);

// LOGOUT
router.post(
  "/logout",
  asyncHandler(authController.logout.bind(authController))
);

// SIGNUP
router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(authController.signup.bind(authController))
);

// VERIFY OTP
router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  asyncHandler(authController.verifyOtp.bind(authController))
);

// RESEND OTP
router.post(
  "/resend-otp",
  otpLimiter,
  validate(resendOtpSchema),
  asyncHandler(authController.resendOtp.bind(authController))
);

// FORGOT PASSWORD
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validate(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword.bind(authController))
);

// RESET PASSWORD
router.post(
  "/reset-password",
  passwordResetLimiter,
  validate(resetPasswordSchema),
  asyncHandler(authController.resetPassword.bind(authController))
);

// GOOGLE LOGIN
router.post(
  "/google",
  loginLimiter,
  asyncHandler(authController.googleLogin.bind(authController))
);

export default router;
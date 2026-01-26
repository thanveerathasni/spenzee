import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AuthController } from "../controllers/AuthController";
import { validateRequest } from "../middleware/validateRequest";
import { loginSchema } from "../validators/auth/login.validator";
import { validate } from "../middleware/validate";
import { signupSchema } from "../validators/auth/signup.validator";
import { verifyOtpSchema } from "../validators/auth/verifyOtp.validator";
import { resendOtpSchema } from "../validators/auth/resendOtp.validator";
import { forgotPasswordSchema } from "../validators/auth/forgotPassword.validator";
import { resetPasswordSchema } from "../validators/auth/resetPassword.validator";

const router = Router();

const authController = container.get<AuthController>(
  TYPES.AuthController
);
router.post("/login", (req, res) =>
  authController.login(req, res)
);

router.post("/refresh", (req, res) =>
  authController.refresh(req, res)
);

router.post("/logout", (req, res) =>
  authController.logout(req, res)
);


router.post(
  "/signup",
  validate(signupSchema),
  authController.signup.bind(authController)
);

router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  authController.verifyOtp.bind(authController)
);
router.post(
  "/resend-otp",
  validate(resendOtpSchema),
  authController.resendOtp.bind(authController)
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword.bind(authController)
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController)
);


export default router;




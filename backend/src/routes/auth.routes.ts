// import { Router } from "express";
// import { container } from "../di/container";
// import { TYPES } from "../di/types";
// import { AuthController } from "../controllers/AuthController";
// import { validate } from "../middleware/validate";
// import { signupSchema } from "../validators/auth/signup.validator";
// import { verifyOtpSchema } from "../validators/auth/verifyOtp.validator";
// import { resendOtpSchema } from "../validators/auth/resendOtp.validator";
// import { forgotPasswordSchema } from "../validators/auth/forgotPassword.validator";
// import { resetPasswordSchema } from "../validators/auth/resetPassword.validator";
// import { loginSchema } from "../validators/auth/login.validator";

// const router = Router();
// const authController = container.get<AuthController>(TYPES.AuthController);

// router.post("/login",validate(loginSchema),authController.login.bind(authController)); router.post("/refresh", authController.refresh.bind(authController()));
// router.post("/logout", authController.logout.bind(authController()));
// router.post("/signup", validate(signupSchema), authController.signup.bind(authController()));
// router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp.bind(authController()));
// router.post("/resend-otp", validate(resendOtpSchema), authController.resendOtp.bind(authController()));
// router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword.bind(authController()));
// router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword.bind(authController()));

// router.post("/google", authController.googleLogin.bind(authController));

// export default router;




import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AuthController } from "../controllers/AuthController";
import { validate } from "../middleware/validate";
import { loginSchema } from "../validators/auth/login.validator";
import { signupSchema } from "../validators/auth/signup.validator";
import { verifyOtpSchema } from "../validators/auth/verifyOtp.validator";
import { resendOtpSchema } from "../validators/auth/resendOtp.validator";
import { forgotPasswordSchema } from "../validators/auth/forgotPassword.validator";
import { resetPasswordSchema } from "../validators/auth/resetPassword.validator";
import { authGuard } from "../middleware/authGuard";
import { roleGuard } from "../middleware/roleGuard";
import { ROLES } from "../constants/roles";

const router = Router();


const authController = container.get<AuthController>(TYPES.AuthController);

// ----------USER AUTH ----------
router.post(
  "/login",
  validate(loginSchema),
  authController.login.bind(authController)
);

router.post(
  "/refresh",
  authController.refresh.bind(authController)
);

router.post(
  "/logout",
  authController.logout.bind(authController)
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

router.post(
  "/google",
  authController.googleLogin.bind(authController)
);

// ---------- ADMIN AUTH----------
// router.get(
//   "/admin/dashboard",
//   authGuard,
//   roleGuard([ROLES.ADMIN]),
//   authController.dashboard.bind(authController)
// );

export default router;

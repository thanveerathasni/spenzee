import { Router } from "express";

import { AuthController } from "../../controllers/user/AuthController";

import { container } from "../../di/container";

import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard";

import { validate } from "../../middleware/validate";

import { ROUTES } from "../../shared/constants/routes";

import { asyncHandler } from "../../shared/middleware/asyncHandler";

import { forgotPasswordSchema } from "../../validators/auth/forgotPassword.validator";

import { loginSchema } from "../../validators/auth/login.validator";

import { resendOtpSchema } from "../../validators/auth/resendOtp.validator";

import { resetPasswordSchema } from "../../validators/auth/resetPassword.validator";

import { signupSchema } from "../../validators/auth/signup.validator";

import { verifyOtpSchema } from "../../validators/auth/verifyOtp.validator";

import { changePasswordSchema } from "../../validators/auth/changePassword.validator";

const router = Router();

const controller =
  container.get<AuthController>(
    TYPES.AuthController,
  );

/* ====================================================== */
/* PUBLIC */
/* ====================================================== */

router.post(
  ROUTES.AUTH.LOGIN,
  validate(loginSchema),
  asyncHandler(
    controller.login.bind(
      controller,
    ),
  ),
);

router.post(
  ROUTES.AUTH.SIGNUP,
  validate(signupSchema),
  asyncHandler(
    controller.signup.bind(
      controller,
    ),
  ),
);

router.post(
  ROUTES.AUTH.LOGOUT,
  asyncHandler(
    controller.logout.bind(
      controller,
    ),
  ),
);

router.post(
  ROUTES.AUTH.REFRESH,
  asyncHandler(
    controller.refresh.bind(
      controller,
    ),
  ),
);

router.post(
  ROUTES.AUTH.VERIFY_OTP,
  validate(verifyOtpSchema),
  asyncHandler(
    controller.verifyOtp.bind(
      controller,
    ),
  ),
);

router.post(
  ROUTES.AUTH.RESEND_OTP,
  validate(resendOtpSchema),
  asyncHandler(
    controller.resendOtp.bind(
      controller,
    ),
  ),
);

router.post(
  ROUTES.AUTH.FORGOT_PASSWORD,
  validate(
    forgotPasswordSchema,
  ),
  asyncHandler(
    controller.forgotPassword.bind(
      controller,
    ),
  ),
);

router.post(
  ROUTES.AUTH.RESET_PASSWORD,
  validate(
    resetPasswordSchema,
  ),
  asyncHandler(
    controller.resetPassword.bind(
      controller,
    ),
  ),
);

router.post(
  ROUTES.AUTH.GOOGLE,
  asyncHandler(
    controller.googleLogin.bind(
      controller,
    ),
  ),
);

/* ====================================================== */
/* EMAIL */
/* ====================================================== */

router.post(
  ROUTES.USER.EMAIL_SEND_OTP,
  authGuard,
  asyncHandler(
    controller.sendEmailOtp.bind(
      controller,
    ),
  ),
);

router.post(
  ROUTES.USER.EMAIL_VERIFY_OTP,
  authGuard,
  asyncHandler(
    controller.verifyEmailOtp.bind(
      controller,
    ),
  ),
);

router.patch(
  ROUTES.USER.EMAIL_UPDATE,
  authGuard,
  asyncHandler(
    controller.updateEmail.bind(
      controller,
    ),
  ),
);

/* ====================================================== */
/* PASSWORD */
/* ====================================================== */

router.post(
  ROUTES.USER.PASSWORD_SEND_OTP,
  authGuard,
  asyncHandler(
    controller.sendPasswordOtp.bind(
      controller,
    ),
  ),
);

router.post(
  ROUTES.USER.PASSWORD_VERIFY_OTP,
  authGuard,
  asyncHandler(
    controller.verifyPasswordOtp.bind(
      controller,
    ),
  ),
);

router.patch(
  ROUTES.USER.PASSWORD_UPDATE,
  authGuard,
  validate(changePasswordSchema),
  asyncHandler(
    controller.updatePassword.bind(
      controller,
    ),
  ),
);

export default router;
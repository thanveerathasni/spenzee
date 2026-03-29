import { Router } from "express";
import { AuthController } from "../../controllers/user/AuthController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { ROUTES } from "../../shared/constants/routes";
import { asyncHandler } from "../../shared/middleware/asyncHandler";

const router = Router();

const controller = container.get<AuthController>(TYPES.AuthController);

router.post(ROUTES.AUTH.LOGIN, asyncHandler(controller.login.bind(controller)));
router.post(ROUTES.AUTH.SIGNUP, asyncHandler(controller.signup.bind(controller)));
router.post(ROUTES.AUTH.LOGOUT, asyncHandler(controller.logout.bind(controller)));
router.post(ROUTES.AUTH.REFRESH, asyncHandler(controller.refresh.bind(controller)));

router.post(ROUTES.AUTH.VERIFY_OTP, asyncHandler(controller.verifyOtp.bind(controller)));
router.post(ROUTES.AUTH.RESEND_OTP, asyncHandler(controller.resendOtp.bind(controller)));
router.post(ROUTES.AUTH.FORGOT_PASSWORD, asyncHandler(controller.forgotPassword.bind(controller)));
router.post(ROUTES.AUTH.RESET_PASSWORD, asyncHandler(controller.resetPassword.bind(controller)));
router.post(ROUTES.AUTH.GOOGLE, asyncHandler(controller.googleLogin.bind(controller)));

export default router;
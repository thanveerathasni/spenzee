import { Router } from "express";
import { ProviderAuthController } from "../../controllers/provider/auth/ProviderAuthController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard";
import { roleGuard } from "../../middleware/roleGuard";

import { ROLES } from "../../shared/constants/roles";
import { ROUTES } from "../../shared/constants/routes";
import { asyncHandler } from "../../shared/middleware/asyncHandler";

const router = Router();

const controller = container.get<ProviderAuthController>(
  TYPES.ProviderAuthController
);

/* ================= PUBLIC ROUTES ================= */

// LOGIN
router.post(
  ROUTES.PROVIDER.LOGIN,
  asyncHandler(controller.login.bind(controller))
);

// SETUP PASSWORD
router.post(
  ROUTES.PROVIDER.SETUP_PASSWORD,
  asyncHandler(controller.setupPassword.bind(controller))
);

// FORGOT PASSWORD
router.post(
  ROUTES.PROVIDER.FORGOT_PASSWORD,
  asyncHandler(controller.forgotPassword.bind(controller))
);

// RESET PASSWORD
router.post(
  ROUTES.PROVIDER.RESET_PASSWORD,
  asyncHandler(controller.resetPassword.bind(controller))
);

/* ================= PROTECTED ROUTES ================= */

// CHANGE PASSWORD
router.patch(
  "/change-password",
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  asyncHandler(controller.changePassword.bind(controller))
);



router.post(
  "/refresh",
  asyncHandler(
    controller.refresh.bind(
      controller,
    ),
  ),
);

router.post(
  "/logout",
  asyncHandler(
    controller.logout.bind(
      controller,
    ),
  ),
);
export default router;
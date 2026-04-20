import { Router } from "express";
import { ProviderController } from "../../controllers/provider/ProviderController";
import { ProviderAuthController } from "../../controllers/provider/auth/ProviderAuthController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard";
import { roleGuard } from "../../middleware/roleGuard";

import { ROLES } from "../../shared/constants/roles";

const router = Router();

const providerController = container.get<ProviderController>(TYPES.ProviderController);
const authController = container.get<ProviderAuthController>(TYPES.ProviderAuthController);

/* ================= PUBLIC ================= */

// REQUEST (ONLY ONE)
router.post("/requests", providerController.createRequest.bind(providerController));

// LOGIN
router.post("/auth/login", authController.login.bind(authController));

// SETUP PASSWORD
router.post("/auth/setup-password", authController.setupPassword.bind(authController));

/* ================= PROTECTED ================= */

router.patch(
  "/auth/change-password",
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  authController.changePassword.bind(authController)
);

router.get(
  "/dashboard",
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  providerController.getDashboard.bind(providerController)
);

router.patch(
  "/profile",
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  providerController.updateProfile.bind(providerController)
);

router.post(
  "/email/change-request",
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  providerController.requestEmailChange.bind(providerController)
);

router.post(
  "/email/verify",
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  providerController.verifyEmailChange.bind(providerController)
);

export default router;
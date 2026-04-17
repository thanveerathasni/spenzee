import { Router } from "express";
import { ProviderController } from "../../controllers/provider/ProviderController";
import { ProviderAuthController } from "../../controllers/provider/auth/ProviderAuthController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard";
import { roleGuard } from "../../middleware/roleGuard";

import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { ROLES } from "../../shared/constants/roles";
import { logger } from "../../shared/logger/logger";

/*  CONTROLLERS */

const router = Router();

/*  GET INSTANCES */
const providerController = container.get<ProviderController>(TYPES.ProviderController);
const authController = container.get<ProviderAuthController>(TYPES.ProviderAuthController);

/* ================= PUBLIC ROUTES ================= */

//  PROVIDER REQUEST 
router.post("/requests", (req, res) => {
  return providerController.createRequest(req, res);
});

//  LOGIN
router.post("/auth/login", (req, res) => {
  return authController.login(req, res);
});

//  SETUP PASSWORD
router.post("/auth/setup-password", (req, res) => {
  return authController.setupPassword(req, res);
});

//  CHANGE PASSWORD 
router.patch(
  "/auth/change-password",
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  (req, res) => {
    return authController.changePassword(req, res);
  }
);

/* ================= PROTECTED ================= */

router.get(
  "/dashboard",
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  (req, res) => {
    logger.info(LOG_MESSAGES.PROVIDER.DASHBOARD_ACCESSED);
    return providerController.getDashboard(req, res);
  }
);

router.patch(
  "/profile",
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  (req, res) => {
    return providerController.updateProfile(req, res);
  }
);

// EMAIL CHANGE
router.post(
  "/email/change-request",
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  (req, res) => {
    return providerController.requestEmailChange(req, res);
  }
);

router.post(
  "/email/verify",
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  (req, res) => {
    return providerController.verifyEmailChange(req, res);
  }
);

export default router;
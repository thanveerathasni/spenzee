import { Router } from "express";
import { AdminController } from "../../controllers/admin/AdminController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard";
import { roleGuard } from "../../middleware/roleGuard";
import { ROLES } from "../../shared/constants/roles";
import { ROUTES } from "../../shared/constants/routes";

const router = Router();

const controller = container.get<AdminController>(TYPES.AdminController);

router.get(
  ROUTES.ADMIN.DASHBOARD,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.getDashboard.bind(controller)
);

/* ================= USERS ================= */

router.get(
  "/users",
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.getUsers.bind(controller)
);

router.get(
  "/users/:id",
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.getUserById.bind(controller)
);

router.patch(
  "/users/:id/status",
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.updateUserStatus.bind(controller)
);

/* ================= PROVIDERS ================= */

router.get(
  "/provider-requests",
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.getProviderRequests.bind(controller)
);

router.patch(
  "/provider-requests/:id/review",
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.reviewProviderRequest.bind(controller)
);
router.get(
  "/providers",
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.getProviders.bind(controller)
);

router.patch(
  "/providers/:id/status",
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.updateProviderStatus.bind(controller)
);

export default router;
import { Router } from "express";
import { ProviderRequestController } from "../../controllers/provider/auth/ProviderRequestController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard";
import { roleGuard } from "../../middleware/roleGuard";
import { ROLES } from "../../shared/constants/roles";
import { asyncHandler } from "../../shared/middleware/asyncHandler";

const router = Router();

const controller = container.get<ProviderRequestController>(TYPES.ProviderRequestController);

router.get(
  "/",
  authGuard,
  roleGuard([ROLES.ADMIN]),
  asyncHandler(controller.getAllRequests.bind(controller))
);

export default router;
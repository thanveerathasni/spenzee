import { Router } from "express";
import { ProviderRequestController } from "../../controllers/provider/auth/ProviderRequestController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard";
import { roleGuard } from "../../middleware/roleGuard";
import { ROLES } from "../../shared/constants/roles";
import { ROUTES } from "../../shared/constants/routes";
import { asyncHandler } from "../../shared/middleware/asyncHandler";

const router = Router();

const controller = container.get<ProviderRequestController>(TYPES.ProviderRequestController);

router.get(
  ROUTES.PROVIDER_REQUEST.ROOT,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  asyncHandler(controller.getAllRequests.bind(controller))
);

router.post(
  ROUTES.PROVIDER_REQUEST.ROOT,
  asyncHandler(controller.createRequest.bind(controller))
);
router.post(
  ROUTES.PROVIDER_REQUEST.REQUESTS,
  asyncHandler(controller.createRequest.bind(controller))
);

export default router;

import { Router } from "express";
import { ProviderController } from "../../controllers/provider/ProviderController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard";
import { roleGuard } from "../../middleware/roleGuard";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { ROLES } from "../../shared/constants/roles";
import { ROUTES } from "../../shared/constants/routes";
import { logger } from "../../shared/logger/logger";

const router = Router();

const controller = container.get<ProviderController>(TYPES.ProviderController);

router.get(
  ROUTES.PROVIDER.DASHBOARD,
  authGuard,
  roleGuard([ROLES.PROVIDER]),
  async (req, res) => {
    logger.info(LOG_MESSAGES.PROVIDER.DASHBOARD_ACCESSED);
    return controller.getDashboard(req, res);
  }
);

export default router;
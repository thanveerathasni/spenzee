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

export default router;
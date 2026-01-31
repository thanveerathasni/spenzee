import { Router } from "express";

import { ROLES } from "../constants/roles";
import { requireRole } from "../middleware/require-role.middleware";
import { authenticate } from "../middleware/authenticateAdmin";

import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AdminController } from "../controllers/admin/AdminController";

const adminRouter = Router();

const adminController = container.get<AdminController>(
  TYPES.AdminController
);

adminRouter.get(
  "/dashboard",
  authenticate,
  requireRole([ROLES.ADMIN]),
  adminController.getDashboard.bind(adminController)
);

export default adminRouter;

import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AdminAuthController } from "../controllers/admin/AdminAuthController";

const router = Router();

const adminAuthController =
  container.get<AdminAuthController>(
    TYPES.AdminAuthController
  );

router.post(
  "/login",
  adminAuthController.login.bind(adminAuthController)
);

router.post(
  "/logout",
  adminAuthController.logout.bind(adminAuthController)
);
router.post(
  "/refresh",
  adminAuthController.refresh.bind(adminAuthController)
);

export default router;

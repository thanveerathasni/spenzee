import { Router } from "express";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { AdminAuthController } from "../../controllers/admin/AdminAuthController";

const router = Router();

const controller = container.get<AdminAuthController>(
  TYPES.AdminAuthController
);

router.post("/login", controller.login);

export default router;

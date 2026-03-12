import { Router } from "express";
import { AdminAuthController } from "../../controllers/admin/AdminAuthController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

const router = Router();

const controller = container.get<AdminAuthController>(TYPES.AdminAuthController);

router.post("/login", controller.login);

export default router;

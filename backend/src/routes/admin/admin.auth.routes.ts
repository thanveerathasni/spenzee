import { Router } from "express";
import { AdminAuthController } from "../../controllers/admin/AdminAuthController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { asyncHandler } from "../../shared/middleware/asyncHandler";


const router = Router();

const controller = container.get<AdminAuthController>(TYPES.AdminAuthController);

router.post(
  "/login",
  asyncHandler(controller.login.bind(controller))
);

export default router;

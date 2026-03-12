import { Router } from "express";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { AdminController } from "../../controllers/admin/AdminController";
import { authenticateAdmin } from "../../middleware/authenticateAdmin";

const router = Router();

const adminController = container.get<AdminController>(TYPES.AdminController);

router.get("/dashboard", authenticateAdmin, adminController.getDashboard.bind(adminController));

export default router;

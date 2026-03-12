import { Router } from "express";
import { AdminController } from "../../controllers/admin/AdminController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { authenticateAdmin } from "../../middleware/authenticateAdmin";

const router = Router();

const adminController = container.get<AdminController>(TYPES.AdminController);

router.get("/dashboard", authenticateAdmin, adminController.getDashboard.bind(adminController));

export default router;

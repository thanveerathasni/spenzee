import { Router } from "express";
import { ProviderController } from "../../controllers/provider/ProviderController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { authenticateProvider } from "../../middleware/authenticateProvider";

const router = Router();

const providerController = container.get<ProviderController>(TYPES.ProviderController);

router.get("/dashboard", authenticateProvider, providerController.getDashboard);

export default router;

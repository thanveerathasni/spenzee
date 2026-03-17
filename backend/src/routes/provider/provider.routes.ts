import { Router } from "express";
import { ProviderController } from "../../controllers/provider/ProviderController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { authenticateProvider } from "../../middleware/authenticateProvider";
import { asyncHandler } from "../../shared/middleware/asyncHandler";

const router = Router();

const providerController = container.get<ProviderController>(TYPES.ProviderController);

router.get(
  "/dashboard",
  authenticateProvider,
  asyncHandler(providerController.getDashboard.bind(providerController))
);

export default router;
import { Router } from "express";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { authenticateProvider } from "../../middleware/authenticateProvider";
import { ProviderController } from "../../controllers/provider/ProviderController";

const router = Router();

const providerController =
  container.get<ProviderController>(
    TYPES.ProviderController
  );

router.get(
  "/dashboard",
  authenticateProvider,
  providerController.getDashboard
);

export default router;
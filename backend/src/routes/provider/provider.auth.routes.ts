import { Router } from "express";
import { ProviderAuthController } from "../../controllers/provider/auth/ProviderAuthController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { asyncHandler } from "../../shared/middleware/asyncHandler";

const router = Router();

const providerAuthController = container.get<ProviderAuthController>(TYPES.ProviderAuthController);

router.post(
  "/login",
  asyncHandler(providerAuthController.login.bind(providerAuthController))
);

router.post(
  "/setup-password",
  asyncHandler(providerAuthController.setupPassword.bind(providerAuthController))
);

export default router;

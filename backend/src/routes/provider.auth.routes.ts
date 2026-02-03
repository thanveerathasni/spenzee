import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { ProviderAuthController } from "../controllers/provider/auth/ProviderAuthController";
const router = Router();

const providerAuthController =
  container.get<ProviderAuthController>(
    TYPES.ProviderAuthController
  );

router.post(
  "/login",
  providerAuthController.login
);

export default router;

import { Router } from "express";
import { ProviderAuthController } from "../../controllers/provider/auth/ProviderAuthController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { ROUTES } from "../../shared/constants/routes";
import { asyncHandler } from "../../shared/middleware/asyncHandler";



const router = Router();

const controller = container.get<ProviderAuthController>(TYPES.ProviderAuthController);

router.post(
  ROUTES.PROVIDER.LOGIN,
  asyncHandler(controller.login.bind(controller))
);

router.post(
  ROUTES.PROVIDER.SETUP_PASSWORD,
  asyncHandler(controller.setupPassword.bind(controller))
);

export default router;
import { Router } from "express";
import { ProviderAuthController } from "../../controllers/provider/auth/ProviderAuthController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
const router = Router();

const providerAuthController = container.get<ProviderAuthController>(TYPES.ProviderAuthController);

router.post("/login", providerAuthController.login);
router.post("/setup-password", providerAuthController.setupPassword);
export default router;

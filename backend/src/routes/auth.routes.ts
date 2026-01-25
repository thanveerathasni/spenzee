import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AuthController } from "../controllers/AuthController";
import { validateRequest } from "../middleware/validateRequest";
import { loginSchema } from "../validators/auth/login.validator";

const router = Router();

const authController = container.get<AuthController>(
  TYPES.AuthController
);

router.post(
  "/login",
  validateRequest(loginSchema),
  (req, res) => authController.login(req, res)
);

export default router;

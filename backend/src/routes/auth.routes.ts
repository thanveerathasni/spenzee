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
router.post("/login", (req, res) =>
  authController.login(req, res)
);

router.post("/refresh", (req, res) =>
  authController.refresh(req, res)
);

router.post("/logout", (req, res) =>
  authController.logout(req, res)
);


export default router;

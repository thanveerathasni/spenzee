import { Router } from "express";
import { UserController } from "../../controllers/user/UserController";

import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard"; // 🔥 FIXED
import { upload } from "../../middleware/upload.middleware";
import { asyncHandler } from "../../shared/middleware/asyncHandler";

const router = Router();

const controller = container.get<UserController>(TYPES.UserController);

/* ---------- ROUTES ---------- */

router.get(
  "/profile",
  authGuard, 
  asyncHandler(controller.getProfile.bind(controller))
);

router.patch(
  "/profile",
  authGuard, 
  asyncHandler(controller.updateProfile.bind(controller))
);

router.patch(
  "/profile/image",
  authGuard, 
  upload.single("image"),
  asyncHandler(controller.uploadProfileImage.bind(controller))
);

router.post(
  "/email/request",
  authGuard, 
  asyncHandler(controller.requestEmailChange.bind(controller))
);

router.post(
  "/email/confirm",
  authGuard, 
  asyncHandler(controller.confirmEmailChange.bind(controller))
);

export default router;
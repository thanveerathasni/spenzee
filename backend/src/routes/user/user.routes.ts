import { Router } from "express";
import { UserController } from "../../controllers/user/UserController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";


import { upload } from "../../middleware/upload.middleware";
import { asyncHandler } from "../../shared/middleware/asyncHandler";
import { protect } from "../../shared/middleware/authMiddleware";

const router = Router();

const controller = container.get<UserController>(TYPES.UserController);

/* ---------- ROUTES ---------- */

router.get(
  "/profile",
  protect,
  asyncHandler(controller.getProfile.bind(controller))
);

router.patch(
  "/profile",
  protect,
  asyncHandler(controller.updateProfile.bind(controller))
);

router.patch(
  "/profile/image",
  protect,
  upload.single("image"),
  asyncHandler(controller.uploadProfileImage.bind(controller))
);
export default router;
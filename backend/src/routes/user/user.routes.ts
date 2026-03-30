import { Router } from "express";
import { UserController } from "../../controllers/user/UserController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { upload } from "../../middleware/upload.middleware";

import { protect } from "../../shared/middleware/authMiddleware";

const router = Router();

const controller = container.get<UserController>(TYPES.UserController);

router.get("/profile", protect, controller.getProfile.bind(controller));
router.patch("/profile", protect, controller.updateProfile.bind(controller));

router.patch(
  "/profile/image",
  protect,
  upload.single("image"),
  controller.uploadProfileImage.bind(controller)
);
export default router;
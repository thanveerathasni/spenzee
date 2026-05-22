import { Router } from "express";
import { NotificationController } from "../controllers/notification/NotificationController";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { authGuard } from "../middleware/authGuard";
import { asyncHandler } from "../shared/middleware/asyncHandler";

const router = Router();
const controller = container.get<NotificationController>(
  TYPES.NotificationController,
);

router.get(
  "/",
  authGuard,
  asyncHandler(controller.list.bind(controller)),
);

router.get(
  "/stream",
  asyncHandler(controller.stream.bind(controller)),
);

router.patch(
  "/:id/read",
  authGuard,
  asyncHandler(controller.markRead.bind(controller)),
);

router.patch(
  "/read-all",
  authGuard,
  asyncHandler(controller.markAllRead.bind(controller)),
);

export default router;

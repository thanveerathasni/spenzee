import { Router } from "express";

import { AdminAuthController } from "../../controllers/admin/AdminAuthController";

import { container } from "../../di/container";

import { TYPES } from "../../di/types";

import { asyncHandler } from "../../shared/middleware/asyncHandler";

const router =
  Router();

const controller =
  container.get<AdminAuthController>(
    TYPES.AdminAuthController,
  );

/* ============================================== */
/* LOGIN */
/* ============================================== */

router.post(
  "/login",
  asyncHandler(
    controller.login.bind(
      controller,
    ),
  ),
);

/* ============================================== */
/* REFRESH */
/* ============================================== */

router.post(
  "/refresh",
  asyncHandler(
    controller.refresh.bind(
      controller,
    ),
  ),
);

/* ============================================== */
/* LOGOUT */
/* ============================================== */

router.post(
  "/logout",
  asyncHandler(
    controller.logout.bind(
      controller,
    ),
  ),
);

export default router;
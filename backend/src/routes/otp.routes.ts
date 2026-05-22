import { Router } from "express";

import { OtpController } from "../controllers/otp.controller";

import { container } from "../di/container";

import { TYPES } from "../di/types";

import { asyncHandler } from "../shared/middleware/asyncHandler";

const router = Router();

const controller =
  container.get<OtpController>(
    TYPES.OtpController,
  );

router.post(
  "/send",
  asyncHandler(
    controller.sendOtp.bind(
      controller,
    ),
  ),
);

router.post(
  "/verify",
  asyncHandler(
    controller.verifyOtp.bind(
      controller,
    ),
  ),
);

export default router;
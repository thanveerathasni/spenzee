import { Router } from "express";

import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { authenticateAdmin } from "../../middleware/authenticateAdmin";
import { ProviderRequestController } from "../../controllers/provider/auth/ProviderRequestController";

const router = Router();

// Resolve controller from DI container
const providerRequestController = container.get<ProviderRequestController>(
  TYPES.ProviderRequestController,
);

/**
 * PUBLIC — Provider submits request
 */
router.post("/provider-requests", (req, res) =>
  providerRequestController.createProviderRequest(req, res),
);

/**
 * ADMIN — View all provider requests
 */
router.get("/admin/provider-requests", authenticateAdmin, (req, res) =>
  providerRequestController.getAllProviderRequests(req, res),
);

/**
 * ADMIN — Filter provider requests by status
 */
router.get("/admin/provider-requests/status/:status", authenticateAdmin, (req, res) =>
  providerRequestController.getProviderRequestsByStatus(req, res),
);

/**
 * ADMIN — Approve / Reject provider request
 */
router.patch("/admin/provider-requests/:requestId/review", authenticateAdmin, (req, res) =>
  providerRequestController.reviewProviderRequest(req, res),
);

export default router;

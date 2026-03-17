import { Router } from "express";
import { ProviderRequestController } from "../../controllers/provider/auth/ProviderRequestController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { authenticateAdmin } from "../../middleware/authenticateAdmin";
import { asyncHandler } from "../../shared/middleware/asyncHandler";

const router = Router();

//  create controller instance from DI container
const providerRequestController = container.get<ProviderRequestController>(
  TYPES.ProviderRequestController
);

/**
 * PUBLIC — Provider submits request
 */
router.post(
  "/provider-requests",
  asyncHandler(
    providerRequestController.createProviderRequest.bind(providerRequestController)
  )
);

/**
 * ADMIN — View all provider requests
 */
router.get(
  "/admin/provider-requests",
  authenticateAdmin,
  asyncHandler(
    providerRequestController.getAllProviderRequests.bind(providerRequestController)
  )
);

/**
 * ADMIN — Filter provider requests by status
 */
router.get(
  "/admin/provider-requests/status/:status",
  authenticateAdmin,
  asyncHandler(
    providerRequestController.getProviderRequestsByStatus.bind(
      providerRequestController
    )
  )
);

/**
 * ADMIN — Approve / Reject provider request
 */
router.patch(
  "/admin/provider-requests/:requestId/review",
  authenticateAdmin,
  asyncHandler(
    providerRequestController.reviewProviderRequest.bind(
      providerRequestController
    )
  )
);

export default router;
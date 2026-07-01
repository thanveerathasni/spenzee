import { Router } from "express";
import { AdminController } from "../../controllers/admin/AdminController";
import { VerificationAdminController } from "../../controllers/admin/VerificationAdminController";
import { FinancialMonitoringController } from "../../controllers/admin/FinancialMonitoringController";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard";
import { roleGuard } from "../../middleware/roleGuard";
import { ROLES } from "../../shared/constants/roles";
import { ROUTES } from "../../shared/constants/routes";
import { asyncHandler } from "../../shared/middleware/asyncHandler";
import { validate } from "../../middleware/validate";
import { verificationListSchema, verificationRejectSchema } from "../../validators/verification.validator";
import { adminStatementListSchema, adminStatementStatusSchema } from "../../validators/bankStatement.validator";
import {
  providerCommerceApproveSchema,
  providerCommerceIdParamSchema,
  providerCommerceRejectSchema,
  providerCommissionUpdateSchema,
} from "../../validators/providerCommerce.validator";

const router = Router();

const controller = container.get<AdminController>(TYPES.AdminController);
const verificationController = container.get<VerificationAdminController>(
  TYPES.VerificationAdminController,
);
const financialMonitoringController = container.get<FinancialMonitoringController>(
  TYPES.FinancialMonitoringController,
);

router.get(
  ROUTES.ADMIN.DASHBOARD,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.getDashboard.bind(controller)
);

/* ================= USERS ================= */

router.get(
  ROUTES.ADMIN_USER.USERS,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.getUsers.bind(controller)
);

router.get(
  ROUTES.ADMIN_USER.USER_BY_ID,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.getUserById.bind(controller)
);

router.patch(
  ROUTES.ADMIN_USER.USER_STATUS,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.updateUserStatus.bind(controller)
);

router.get(
  ROUTES.ADMIN_USER.USER_STATEMENTS,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  validate(adminStatementListSchema),
  asyncHandler(financialMonitoringController.statements.bind(financialMonitoringController))
);

router.get(
  ROUTES.ADMIN_USER.USER_ANALYTICS,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  asyncHandler(financialMonitoringController.analytics.bind(financialMonitoringController))
);

router.patch(
  ROUTES.ADMIN_USER.USER_STATEMENT_STATUS,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  validate(adminStatementStatusSchema),
  asyncHandler(financialMonitoringController.updateStatementStatus.bind(financialMonitoringController))
);

/* ================= PROVIDERS ================= */

router.get(
  ROUTES.ADMIN_USER.PROVIDER_REQUESTS,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.getProviderRequests.bind(controller)
);

router.patch(
  ROUTES.ADMIN_USER.PROVIDER_REQUEST_REVIEW,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.reviewProviderRequest.bind(controller)
);
router.get(
  ROUTES.ADMIN_USER.PROVIDERS,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.getProviders.bind(controller)
);

router.get(
  ROUTES.ADMIN_USER.PROVIDER_COMMERCE,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  asyncHandler(controller.getCommerceProviders.bind(controller))
);

router.get(
  ROUTES.ADMIN_USER.PROVIDER_BY_ID,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.getProviderById.bind(controller)
);

router.patch(
  ROUTES.ADMIN_USER.PROVIDER_STATUS,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  controller.updateProviderStatus.bind(controller)
);

router.patch(
  ROUTES.ADMIN_USER.PROVIDER_COMMERCE_APPROVE,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  validate(providerCommerceApproveSchema),
  asyncHandler(controller.approveProviderCommerce.bind(controller))
);

router.patch(
  ROUTES.ADMIN_USER.PROVIDER_COMMERCE_REJECT,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  validate(providerCommerceRejectSchema),
  asyncHandler(controller.rejectProviderCommerce.bind(controller))
);

router.patch(
  ROUTES.ADMIN_USER.PROVIDER_COMMERCE_FREEZE,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  validate(providerCommerceIdParamSchema),
  asyncHandler(controller.freezeProviderCommerce.bind(controller))
);

router.patch(
  ROUTES.ADMIN_USER.PROVIDER_COMMERCE_RESUME,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  validate(providerCommerceIdParamSchema),
  asyncHandler(controller.resumeProviderCommerce.bind(controller))
);

router.patch(
  ROUTES.ADMIN_USER.PROVIDER_COMMISSION,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  validate(providerCommissionUpdateSchema),
  asyncHandler(controller.updateProviderCommission.bind(controller))
);

router.get(
  ROUTES.ADMIN.USER_VERIFICATIONS,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  validate(verificationListSchema),
  asyncHandler(verificationController.listUserVerifications.bind(verificationController))
);

router.get(
  ROUTES.ADMIN.USER_VERIFICATION_BY_ID,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  asyncHandler(verificationController.getUserVerification.bind(verificationController))
);

router.patch(
  ROUTES.ADMIN.USER_VERIFICATION_APPROVE,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  asyncHandler(verificationController.approveUserVerification.bind(verificationController))
);

router.patch(
  ROUTES.ADMIN.USER_VERIFICATION_REJECT,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  validate(verificationRejectSchema),
  asyncHandler(verificationController.rejectUserVerification.bind(verificationController))
);

router.get(
  ROUTES.ADMIN.PROVIDER_VERIFICATIONS,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  validate(verificationListSchema),
  asyncHandler(verificationController.listProviderVerifications.bind(verificationController))
);

router.get(
  ROUTES.ADMIN.PROVIDER_VERIFICATION_BY_ID,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  asyncHandler(verificationController.getProviderVerification.bind(verificationController))
);

router.patch(
  ROUTES.ADMIN.PROVIDER_VERIFICATION_APPROVE,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  asyncHandler(verificationController.approveProviderVerification.bind(verificationController))
);

router.patch(
  ROUTES.ADMIN.PROVIDER_VERIFICATION_REJECT,
  authGuard,
  roleGuard([ROLES.ADMIN]),
  validate(verificationRejectSchema),
  asyncHandler(verificationController.rejectProviderVerification.bind(verificationController))
);

export default router;

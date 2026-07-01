import { Router } from "express";

import { ProviderController } from "../../controllers/provider/ProviderController";

import { ProviderAuthController } from "../../controllers/provider/auth/ProviderAuthController";

import { ProviderVerificationController } from "../../controllers/provider/ProviderVerificationController";

import { container } from "../../di/container";

import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard";

import {
  documentUpload,
  upload,
} from "../../middleware/upload.middleware";

import { providerTermsGuard } from "../../middleware/providerTermsGuard";

import { requireCommerceEnabled } from "../../middleware/requireCommerceEnabled";

import { roleGuard } from "../../middleware/roleGuard";

import { validate } from "../../middleware/validate";

import { ROUTES } from "../../shared/constants/routes";

import { ROLES } from "../../shared/constants/roles";

import { asyncHandler } from "../../shared/middleware/asyncHandler";

import {
  providerEmailChangeRequestSchema,
  providerEmailChangeVerifySchema,
  providerPasswordChangeSchema,
} from "../../validators/providerSettings.validator";

import {
  providerVerificationUploadSchema,
} from "../../validators/verification.validator";

import {
  updateProfileSchema,
} from "../../validators/updateProfile.validator";

const router = Router();

const providerController =
  container.get<ProviderController>(
    TYPES.ProviderController,
  );

const authController =
  container.get<ProviderAuthController>(
    TYPES.ProviderAuthController,
  );

const providerVerificationController =
  container.get<ProviderVerificationController>(
    TYPES.ProviderVerificationController,
  );

/* ====================================================== */
/* PUBLIC */
/* ====================================================== */

router.post(
  ROUTES.PROVIDER.REQUESTS,
  asyncHandler(
    providerController.createRequest.bind(
      providerController,
    ),
  ),
);

router.post(
  ROUTES.PROVIDER.AUTH_LOGIN,
  asyncHandler(
    authController.login.bind(
      authController,
    ),
  ),
);

router.post(
  ROUTES.PROVIDER.AUTH_SETUP_PASSWORD,
  asyncHandler(
    authController.setupPassword.bind(
      authController,
    ),
  ),
);

router.post(
  ROUTES.PROVIDER.AUTH_FORGOT_PASSWORD,
  asyncHandler(
    authController.forgotPassword.bind(
      authController,
    ),
  ),
);

router.post(
  ROUTES.PROVIDER.AUTH_RESET_PASSWORD,
  asyncHandler(
    authController.resetPassword.bind(
      authController,
    ),
  ),
);

/* ====================================================== */
/* PROTECTED */
/* ====================================================== */

router.patch(
  ROUTES.PROVIDER.AUTH_CHANGE_PASSWORD,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  validate(
    providerPasswordChangeSchema,
  ),
  asyncHandler(
    authController.changePassword.bind(
      authController,
    ),
  ),
);

router.get(
  ROUTES.PROVIDER.DASHBOARD,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  providerTermsGuard,
  requireCommerceEnabled,
  asyncHandler(
    providerController.getDashboard.bind(
      providerController,
    ),
  ),
);

router.get(
  ROUTES.PROVIDER.COMMERCE_STATUS,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  asyncHandler(
    providerController.getCommerceStatus.bind(
      providerController,
    ),
  ),
);

router.get(
  ROUTES.PROVIDER.PROFILE,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  asyncHandler(
    providerController.getProfile.bind(
      providerController,
    ),
  ),
);

router.patch(
  ROUTES.PROVIDER.PROFILE,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  validate(
    updateProfileSchema,
  ),
  asyncHandler(
    providerController.updateProfile.bind(
      providerController,
    ),
  ),
);

router.patch(
  ROUTES.PROVIDER.PROFILE_IMAGE,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  upload.single("image"),
  asyncHandler(
    providerController.uploadProfileImage.bind(
      providerController,
    ),
  ),
);

router.delete(
  ROUTES.PROVIDER.PROFILE_IMAGE,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  asyncHandler(
    providerController.removeProfileImage.bind(
      providerController,
    ),
  ),
);

router.post(
  ROUTES.PROVIDER.EMAIL_CHANGE_REQUEST,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  validate(
    providerEmailChangeRequestSchema,
  ),
  asyncHandler(
    providerController.requestEmailChange.bind(
      providerController,
    ),
  ),
);

router.post(
  ROUTES.PROVIDER.EMAIL_VERIFY,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  validate(
    providerEmailChangeVerifySchema,
  ),
  asyncHandler(
    providerController.verifyEmailChange.bind(
      providerController,
    ),
  ),
);

router.patch(
  ROUTES.PROVIDER.ACCEPT_TERMS,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  asyncHandler(
    providerController.acceptTerms.bind(
      providerController,
    ),
  ),
);

router.post(
  ROUTES.PROVIDER.VERIFICATION,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  documentUpload.single(
    "document",
  ),
  validate(
    providerVerificationUploadSchema,
  ),
  asyncHandler(
    providerVerificationController.submit.bind(
      providerVerificationController,
    ),
  ),
);

router.get(
  ROUTES.PROVIDER.VERIFICATION_STATUS,
  authGuard,
  roleGuard([
    ROLES.PROVIDER,
  ]),
  asyncHandler(
    providerVerificationController.getStatus.bind(
      providerVerificationController,
    ),
  ),
);

export default router;

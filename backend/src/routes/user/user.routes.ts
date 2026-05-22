import { Router } from "express";
import { UserController } from "../../controllers/user/UserController";
import { AddressController } from "../../controllers/user/AddressController";
import { UserVerificationController } from "../../controllers/user/UserVerificationController";
import { BankStatementController } from "../../controllers/user/BankStatementController";

import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { authGuard } from "../../middleware/authGuard";
import { bankStatementUpload, documentUpload, upload } from "../../middleware/upload.middleware";
import { validate } from "../../middleware/validate";
import { ROUTES } from "../../shared/constants/routes";
import { asyncHandler } from "../../shared/middleware/asyncHandler";
import { addressSchema, updateAddressSchema } from "../../validators/address.validator";
import { userVerificationUploadSchema } from "../../validators/verification.validator";
import { bankTransactionListSchema } from "../../validators/bankStatement.validator";

const router = Router();

const controller = container.get<UserController>(TYPES.UserController);
const addressController = container.get<AddressController>(TYPES.AddressController);
const userVerificationController = container.get<UserVerificationController>(
  TYPES.UserVerificationController,
);
const bankStatementController = container.get<BankStatementController>(
  TYPES.BankStatementController,
);

/* ---------- ROUTES ---------- */

router.get(
  ROUTES.USER.PROFILE,
  authGuard, 
  asyncHandler(controller.getProfile.bind(controller))
);

router.patch(
  ROUTES.USER.PROFILE,
  authGuard, 
  asyncHandler(controller.updateProfile.bind(controller))
);

router.patch(
  ROUTES.USER.PROFILE_IMAGE,
  authGuard, 
  upload.single("image"),
  asyncHandler(controller.uploadProfileImage.bind(controller))
);

router.delete(
  ROUTES.USER.PROFILE_IMAGE,
  authGuard,
  asyncHandler(controller.removeProfileImage.bind(controller))
);

router.post(
  ROUTES.USER.EMAIL_REQUEST,
  authGuard, 
  asyncHandler(controller.requestEmailChange.bind(controller))
);

router.post(
  ROUTES.USER.EMAIL_CONFIRM,
  authGuard, 
  asyncHandler(controller.confirmEmailChange.bind(controller))
);

router.get(
  ROUTES.USER.ADDRESS_BASE,
  authGuard,
  asyncHandler(addressController.list.bind(addressController))
);

router.get(
  ROUTES.USER.ADDRESS_PRIMARY_CURRENT,
  authGuard,
  asyncHandler(addressController.getPrimary.bind(addressController))
);

router.post(
  ROUTES.USER.ADDRESS_BASE,
  authGuard,
  validate(addressSchema),
  asyncHandler(addressController.create.bind(addressController))
);

router.patch(
  ROUTES.USER.ADDRESS_BY_ID,
  authGuard,
  validate(updateAddressSchema),
  asyncHandler(addressController.update.bind(addressController))
);

router.delete(
  ROUTES.USER.ADDRESS_BY_ID,
  authGuard,
  asyncHandler(addressController.delete.bind(addressController))
);

router.patch(
  ROUTES.USER.ADDRESS_PRIMARY,
  authGuard,
  asyncHandler(addressController.setPrimary.bind(addressController))
);

router.post(
  ROUTES.USER.VERIFICATION,
  authGuard,
  documentUpload.fields([
    { name: "frontDocument", maxCount: 1 },
    { name: "backDocument", maxCount: 1 },
  ]),
  validate(userVerificationUploadSchema),
  asyncHandler(userVerificationController.submit.bind(userVerificationController))
);

router.get(
  ROUTES.USER.VERIFICATION_STATUS,
  authGuard,
  asyncHandler(userVerificationController.getStatus.bind(userVerificationController))
);

router.get(
  ROUTES.USER.BANK_UPLOAD_ACCESS,
  authGuard,
  asyncHandler(userVerificationController.getBankUploadAccess.bind(userVerificationController))
);

router.post(
  ROUTES.USER.BANK_STATEMENTS_UPLOAD,
  authGuard,
  bankStatementUpload.array("statements", 6),
  asyncHandler(bankStatementController.upload.bind(bankStatementController))
);

router.get(
  ROUTES.USER.BANK_STATEMENTS_ANALYTICS,
  authGuard,
  asyncHandler(bankStatementController.analytics.bind(bankStatementController))
);

router.get(
  ROUTES.USER.BANK_STATEMENTS_TRANSACTIONS,
  authGuard,
  validate(bankTransactionListSchema),
  asyncHandler(bankStatementController.transactions.bind(bankStatementController))
);

router.get(
  ROUTES.USER.BANK_STATEMENTS,
  authGuard,
  asyncHandler(bankStatementController.list.bind(bankStatementController))
);

router.get(
  ROUTES.USER.BANK_STATEMENT_BY_ID,
  authGuard,
  asyncHandler(bankStatementController.detail.bind(bankStatementController))
);

router.delete(
  ROUTES.USER.BANK_STATEMENT_BY_ID,
  authGuard,
  asyncHandler(bankStatementController.delete.bind(bankStatementController))
);

export default router;

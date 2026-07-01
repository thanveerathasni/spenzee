import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  ProviderModel,
} from "../models/Provider.model";

import {
  ProviderVerificationModel,
} from "../models/ProviderVerification.model";

import {
  COMMERCE_STATUS,
} from "../shared/constants/commerce";

import {
  ERROR_MESSAGES,
} from "../shared/constants/errorMessages";

import {
  VERIFICATION_STATUS,
} from "../shared/constants/verification";

import {
  ForbiddenError,
  UnauthorizedError,
} from "../shared/errors/errors";

export const requireCommerceEnabled =
  async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const providerId =
        req.user?.id;

      if (!providerId) {
        throw new UnauthorizedError(
          ERROR_MESSAGES.AUTH
            .ACCESS_DENIED,
        );
      }

      const provider =
        await ProviderModel.findById(
          providerId,
        ).exec();

      if (!provider) {
        throw new UnauthorizedError(
          ERROR_MESSAGES.AUTH
            .PROVIDER_NOT_FOUND,
        );
      }

      const latestVerification =
        await ProviderVerificationModel.findOne(
          {
            providerId,
          },
        )
          .sort({
            createdAt: -1,
          })
          .exec();

      if (
        latestVerification
          ?.verificationStatus !==
        VERIFICATION_STATUS.APPROVED
      ) {
        throw new ForbiddenError(
          ERROR_MESSAGES.PROVIDER_COMMERCE
            .PROVIDER_NOT_VERIFIED,
        );
      }

      if (
        provider.commerceStatus ===
        COMMERCE_STATUS.REJECTED
      ) {
        throw new ForbiddenError(
          provider.commerceRejectedReason ||
            ERROR_MESSAGES.PROVIDER_COMMERCE
              .REJECTED,
        );
      }

      if (
        provider.isCommerceFrozen ||
        provider.commerceStatus ===
          COMMERCE_STATUS.FROZEN
      ) {
        throw new ForbiddenError(
          ERROR_MESSAGES.PROVIDER_COMMERCE
            .FROZEN,
        );
      }

      if (
        !provider.commerceEnabled ||
        provider.commerceStatus !==
          COMMERCE_STATUS.APPROVED
      ) {
        throw new ForbiddenError(
          ERROR_MESSAGES.PROVIDER_COMMERCE
            .PENDING,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };

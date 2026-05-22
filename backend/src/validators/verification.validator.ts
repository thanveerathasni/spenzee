import { z } from "zod";
import {
  PROVIDER_LICENSE_TYPES,
  USER_DOCUMENT_TYPES,
  VERIFICATION_STATUS,
} from "../shared/constants/verification";

export const userVerificationUploadSchema = z.object({
  body: z.object({
    documentType: z.enum([
      USER_DOCUMENT_TYPES.AADHAAR,
      USER_DOCUMENT_TYPES.PASSPORT,
      USER_DOCUMENT_TYPES.DRIVING_LICENSE,
      USER_DOCUMENT_TYPES.NATIONAL_ID,
    ]),
  }),
});

export const providerVerificationUploadSchema = z.object({
  body: z.object({
    licenseType: z.enum([
      PROVIDER_LICENSE_TYPES.TRADE_LICENSE,
      PROVIDER_LICENSE_TYPES.GST_CERTIFICATE,
      PROVIDER_LICENSE_TYPES.BUSINESS_REGISTRATION,
    ]),
  }),
});

export const verificationRejectSchema = z.object({
  body: z.object({
    rejectionReason: z.string().min(3).max(500).trim(),
  }),
});

export const verificationListSchema = z.object({
  query: z.object({
    status: z
      .enum([
        VERIFICATION_STATUS.PENDING,
        VERIFICATION_STATUS.APPROVED,
        VERIFICATION_STATUS.REJECTED,
      ])
      .optional(),
    search: z.string().optional(),
  }),
});

export type UserVerificationUploadDTO =
  z.infer<typeof userVerificationUploadSchema>["body"];
export type ProviderVerificationUploadDTO =
  z.infer<typeof providerVerificationUploadSchema>["body"];
export type VerificationRejectDTO =
  z.infer<typeof verificationRejectSchema>["body"];

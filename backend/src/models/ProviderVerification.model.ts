import { Document, Schema, Types, model } from "mongoose";
import {
  PROVIDER_LICENSE_TYPES,
  ProviderLicenseType,
  VERIFICATION_STATUS,
  VerificationStatus,
} from "../shared/constants/verification";

export interface IProviderVerification extends Document {
  providerId: Types.ObjectId;
  licenseType: ProviderLicenseType;
  documentUrl: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const providerVerificationSchema = new Schema<IProviderVerification>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      index: true,
    },
    licenseType: {
      type: String,
      enum: Object.values(PROVIDER_LICENSE_TYPES),
      required: true,
    },
    documentUrl: { type: String, required: true, trim: true },
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
      index: true,
    },
    rejectionReason: { type: String, trim: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    reviewedAt: { type: Date },
  },
  { timestamps: true },
);

providerVerificationSchema.index({ providerId: 1, createdAt: -1 });

export const ProviderVerificationModel = model<IProviderVerification>(
  "ProviderVerification",
  providerVerificationSchema,
);

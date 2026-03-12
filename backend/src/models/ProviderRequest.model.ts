import { Schema, model, Document } from "mongoose";

export enum ProviderRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IProviderRequest extends Document {
  readonly brandName: string;
  readonly websiteUrl: string;
  readonly primaryCategory: string;
  readonly contactEmail: string;
  readonly description: string;

  status: ProviderRequestStatus;

  reviewedBy?: Schema.Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ProviderRequestSchema = new Schema<IProviderRequest>(
  {
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    websiteUrl: {
      type: String,
      required: true,
      trim: true,
    },
    primaryCategory: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(ProviderRequestStatus),
      default: ProviderRequestStatus.PENDING,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ProviderRequestModel = model<IProviderRequest>(
  "ProviderRequest",
  ProviderRequestSchema,
);

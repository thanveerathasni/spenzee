import { Document, Schema, Types, model } from "mongoose";
import {
  USER_DOCUMENT_TYPES,
  UserDocumentType,
  VERIFICATION_STATUS,
  VerificationStatus,
} from "../shared/constants/verification";

export interface IUserVerification extends Document {
  userId: Types.ObjectId;
  documentType: UserDocumentType;
  frontDocumentUrl: string;
  backDocumentUrl?: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userVerificationSchema = new Schema<IUserVerification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    documentType: {
      type: String,
      enum: Object.values(USER_DOCUMENT_TYPES),
      required: true,
    },
    frontDocumentUrl: { type: String, required: true, trim: true },
    backDocumentUrl: { type: String, trim: true },
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

userVerificationSchema.index({ userId: 1, createdAt: -1 });

export const UserVerificationModel = model<IUserVerification>(
  "UserVerification",
  userVerificationSchema,
);

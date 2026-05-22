import {
  Document,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  BANK_STATEMENT_STATUS,
  BankStatementStatus,
} from "../shared/constants/bankStatement";

export interface IBankStatement extends Document {
  userId: Types.ObjectId;
  originalFileUrl: string;
  originalFileName: string;
  fileHash: string;
  mimeType: string;
  fileSize: number;
  bankName: string;
  periodStart?: Date;
  periodEnd?: Date;
  coverageDays: number;
  status: BankStatementStatus;
  rejectionReason?: string;
  isSuspicious: boolean;
  analyticsFrozen: boolean;
  adminNote?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bankStatementSchema =
  new Schema<IBankStatement>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      originalFileUrl: {
        type: String,
        required: true,
        trim: true,
      },
      originalFileName: {
        type: String,
        required: true,
        trim: true,
      },
      fileHash: {
        type: String,
        required: true,
        trim: true,
      },
      mimeType: {
        type: String,
        required: true,
        trim: true,
      },
      fileSize: {
        type: Number,
        required: true,
      },
      bankName: {
        type: String,
        default: "Unknown Bank",
        trim: true,
      },
      periodStart: {
        type: Date,
      },
      periodEnd: {
        type: Date,
      },
      coverageDays: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        enum: Object.values(
          BANK_STATEMENT_STATUS,
        ),
        default:
          BANK_STATEMENT_STATUS.UPLOADED,
        index: true,
      },
      rejectionReason: {
        type: String,
        trim: true,
      },
      isSuspicious: {
        type: Boolean,
        default: false,
      },
      analyticsFrozen: {
        type: Boolean,
        default: false,
      },
      adminNote: {
        type: String,
        trim: true,
      },
      processedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    },
  );

bankStatementSchema.index({
  userId: 1,
  fileHash: 1,
}, {
  unique: true,
});
bankStatementSchema.index({
  userId: 1,
  createdAt: -1,
});
bankStatementSchema.index({
  userId: 1,
  status: 1,
});

export const BankStatementModel =
  model<IBankStatement>(
    "BankStatement",
    bankStatementSchema,
  );

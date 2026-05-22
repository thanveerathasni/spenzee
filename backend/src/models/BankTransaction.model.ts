import {
  Document,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  BANK_TRANSACTION_TYPE,
  BankTransactionType,
  FINANCIAL_CATEGORY,
  FinancialCategory,
} from "../shared/constants/bankStatement";

export interface IBankTransaction extends Document {
  userId: Types.ObjectId;
  statementId: Types.ObjectId;
  transactionDate: Date;
  description: string;
  normalizedDescription: string;
  merchant: string;
  referenceId?: string;
  amount: number;
  type: BankTransactionType;
  balance?: number;
  category: FinancialCategory;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bankTransactionSchema =
  new Schema<IBankTransaction>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      statementId: {
        type: Schema.Types.ObjectId,
        ref: "BankStatement",
        required: true,
        index: true,
      },
      transactionDate: {
        type: Date,
        required: true,
        index: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      normalizedDescription: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
      merchant: {
        type: String,
        default: "Unknown",
        trim: true,
      },
      referenceId: {
        type: String,
        trim: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        enum: Object.values(
          BANK_TRANSACTION_TYPE,
        ),
        required: true,
      },
      balance: {
        type: Number,
      },
      category: {
        type: String,
        enum: Object.values(
          FINANCIAL_CATEGORY,
        ),
        default:
          FINANCIAL_CATEGORY.OTHERS,
        index: true,
      },
      isRecurring: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    },
  );

bankTransactionSchema.index({
  userId: 1,
  transactionDate: -1,
});
bankTransactionSchema.index({
  userId: 1,
  category: 1,
  transactionDate: -1,
});
bankTransactionSchema.index({
  statementId: 1,
  transactionDate: 1,
});

export const BankTransactionModel =
  model<IBankTransaction>(
    "BankTransaction",
    bankTransactionSchema,
  );

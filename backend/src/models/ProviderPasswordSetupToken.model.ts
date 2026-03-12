import { Schema, model, Document, Types } from "mongoose";

export interface IProviderPasswordSetupToken extends Document {
  readonly providerId: Types.ObjectId;
  readonly hashedToken: string;
  readonly expiresAt: Date;
  isUsed: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ProviderPasswordSetupTokenSchema = new Schema<IProviderPasswordSetupToken>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    hashedToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const ProviderPasswordSetupTokenModel = model<IProviderPasswordSetupToken>(
  "ProviderPasswordSetupToken",
  ProviderPasswordSetupTokenSchema,
);

import { Schema, model, Document } from "mongoose";

export enum ProviderStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
}

export interface IProvider extends Document {
  readonly brandName: string;
  readonly email: string;
  readonly primaryCategory: string;
  readonly websiteUrl?: string;
  readonly description?: string;

  readonly role: "provider";
  status: ProviderStatus;

  password?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema = new Schema<IProvider>(
  {
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    primaryCategory: {
      type: String,
      required: true,
      trim: true,
    },
    websiteUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["provider"],
      default: "provider",
      immutable: true,
    },

    status: {
      type: String,
      enum: Object.values(ProviderStatus),
      default: ProviderStatus.ACTIVE,
    },

    password: {
      type: String,
      select: false, 
    },
  },
  {
    timestamps: true,
  }
);

export const ProviderModel = model<IProvider>(
  "Provider",
  ProviderSchema
);

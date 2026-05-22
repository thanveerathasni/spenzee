import {
  Document,
  model,
  Schema,
} from "mongoose";

export enum ProviderStatus {
  PENDING = "pending",

  ACTIVE = "active",

  SUSPENDED = "suspended",

  BLOCKED = "blocked",

  REJECTED = "rejected",
}

export interface IProvider
  extends Document {
  readonly brandName: string;

  readonly email: string;

  readonly primaryCategory: string;

  readonly companyName?: string;

  readonly websiteUrl?: string;

  readonly phone?: string;

  readonly gstNumber?: string;

  readonly licenseNumber?: string;

  readonly socialLinks?: string[];

  readonly profileImage?: string;

  readonly description?: string;

  readonly hasAcceptedTerms: boolean;

  readonly role: "provider";

  status: ProviderStatus;

  password?: string;

  createdAt: Date;

  updatedAt: Date;
}

const providerSchema =
  new Schema<IProvider>(
    {
      brandName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      primaryCategory: {
        type: String,
        required: true,
        trim: true,
      },

      companyName: {
        type: String,
        trim: true,
      },

      websiteUrl: {
        type: String,
        trim: true,
      },

      phone: {
        type: String,
        trim: true,
      },

      gstNumber: {
        type: String,
        trim: true,
      },

      licenseNumber: {
        type: String,
        trim: true,
      },

      socialLinks: {
        type: [String],
        default: [],
      },

      profileImage: {
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
        enum:
          Object.values(
            ProviderStatus,
          ),
        default:
          ProviderStatus.PENDING,
      },

      password: {
        type: String,
        select: false,
      },

      hasAcceptedTerms: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    },
  );

/* ====================================================== */
/* INDEXES */
/* ====================================================== */

providerSchema.index({
  email: 1,
});

providerSchema.index({
  status: 1,
});

providerSchema.index({
  brandName: "text",
  email: "text",
  primaryCategory: "text",
});

providerSchema.index({
  createdAt: -1,
});

export const ProviderModel =
  model<IProvider>(
    "Provider",
    providerSchema,
  );
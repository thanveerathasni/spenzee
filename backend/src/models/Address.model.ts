import {
  Document,
  model,
  Schema,
  Types,
} from "mongoose";

export const ADDRESS_TYPES =
  {
    HOME: "home",

    WORK: "work",

    OTHER: "other",
  } as const;

export type AddressType =
  (typeof ADDRESS_TYPES)[keyof typeof ADDRESS_TYPES];

export interface IAddress
  extends Document {
  userId: Types.ObjectId;

  fullName: string;

  phone: string;

  alternatePhone?: string;

  houseName: string;

  street: string;

  city: string;

  district: string;

  state: string;

  country: string;

  postalCode: string;

  landmark?: string;

  addressType: AddressType;

  isPrimary: boolean;

  createdAt: Date;

  updatedAt: Date;
}

const addressSchema =
  new Schema<IAddress>(
    {
      userId: {
        type:
          Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      alternatePhone: {
        type: String,
        trim: true,
      },

      houseName: {
        type: String,
        required: true,
        trim: true,
      },

      street: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      district: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        required: true,
        trim: true,
        default: "India",
      },

      postalCode: {
        type: String,
        required: true,
        trim: true,
      },

      landmark: {
        type: String,
        trim: true,
      },

      addressType: {
        type: String,
        enum:
          Object.values(
            ADDRESS_TYPES,
          ),
        default:
          ADDRESS_TYPES.HOME,
      },

      isPrimary: {
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

addressSchema.index({
  userId: 1,
});

addressSchema.index({
  userId: 1,
  isPrimary: 1,
});

addressSchema.index({
  createdAt: -1,
});

export const AddressModel =
  model<IAddress>(
    "Address",
    addressSchema,
  );
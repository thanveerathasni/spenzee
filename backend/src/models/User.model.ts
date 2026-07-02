import { Schema, model, Document, Types } from "mongoose";
import { ROLES, Role } from "../constants/roles";
import {
  COMMERCE_STATUS,
  COMMERCE_VALIDATION,
  COMMISSION_LIMITS,
  CommerceStatus,
} from "../constants/commerce";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string | null;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  commerceStatus: CommerceStatus;
  commerceEnabled: boolean;
  commissionPercentage: number;
  commerceApprovedAt?: Date;
  commerceApprovedBy?: Types.ObjectId;
  commerceRejectedReason?: string;
  commerceFrozen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
      name: {
    type: String,
    required: false,
    trim: true,
  },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
   password: {
  type: String,
  required: false,
  default: null
},
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    commerceStatus: {
      type: String,
      enum: Object.values(COMMERCE_STATUS),
      default: COMMERCE_STATUS.PENDING
    },
    commerceEnabled: {
      type: Boolean,
      default: false
    },
    commissionPercentage: {
      type: Number,
      min: COMMISSION_LIMITS.MIN_COMMISSION,
      max: COMMISSION_LIMITS.MAX_COMMISSION,
      default: COMMISSION_LIMITS.DEFAULT_COMMISSION
    },
    commerceApprovedAt: {
      type: Date
    },
    commerceApprovedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    commerceRejectedReason: {
      type: String,
      trim: true,
      maxlength: COMMERCE_VALIDATION.REJECTION_REASON_MAX_LENGTH
    },
    commerceFrozen: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = model<IUser>("User", userSchema);

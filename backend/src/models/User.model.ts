import { Schema, model, Document } from "mongoose";
import { ROLES, Role } from "../constants/roles";
import { COMMERCE_STATUS, CommerceStatus } from "../constants/commerce";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  commerceStatus: CommerceStatus;
  commerceEnabled: boolean;
  isCommerceFrozen: boolean;
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
    isCommerceFrozen: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = model<IUser>("User", userSchema);

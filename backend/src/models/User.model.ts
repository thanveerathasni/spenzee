import { Schema, model, Document } from "mongoose";
import { ROLES, Role } from "../shared/constants/roles";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string | null;
  role: Role;
  isVerified: boolean;
  isActive: boolean;

  phone?: string;
  profileImage?: string;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },


    phone: {
      type: String,
      trim: true,
    },
profileImage: {
  type: String,
  required: false,
},

    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>("User", userSchema);
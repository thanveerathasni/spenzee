import { Schema, model, Document } from "mongoose";
import { ROLES, Role } from "../constants/roles";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
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
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = model<IUser>("User", userSchema);

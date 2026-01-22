import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "provider" | "admin";
  refreshToken?: string;

  otp?: string;
  otpExpiresAt?: Date;
  isVerified: boolean;

  otpRequestCount?: number;
  otpLastRequestAt?: Date | null;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },
    refreshToken: { type: String },

    otp: { type: String },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },

    otpRequestCount: { type: Number, default: 0 },
    otpLastRequestAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);

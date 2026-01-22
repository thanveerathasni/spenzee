import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "provider" | "admin";
  refreshToken?: string;

  otp?: string;
  otpExpiresAt?: Date;
  isVerified: boolean;

  otpRequestCount?: number;
  otpLastRequestAt?: Date | null;

  authProvider: "local" | "google";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    // 🔥 CHANGE ONLY THIS (conditional required)
    password: {
      type: String,
      required: function (this: IUser) {
        return this.authProvider === "local";
      },
    },

    // 🔥 ADD ONLY THIS FIELD
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

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

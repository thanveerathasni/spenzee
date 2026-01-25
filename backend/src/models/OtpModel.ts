import { Schema, model } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true
    },
    otpHash: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

export const OtpModel = model("Otp", otpSchema);

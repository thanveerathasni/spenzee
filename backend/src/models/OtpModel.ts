// import { Schema, model } from "mongoose";

// const otpSchema = new Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     otpHash: {
//       type: String,
//       required: true,
//     },
//     expiresAt: {
//       type: Date,
//       required: true,
//     },
//     attempts: {
//       type: Number,
//       default: 1,
//     },
//     firstRequestedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export const OtpModel = model("Otp", otpSchema);





import mongoose, { Document, Schema } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
  firstRequestedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
        firstRequestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const OtpModel = mongoose.model<IOtp>("Otp", otpSchema);
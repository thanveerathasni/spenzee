import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IOtp
  extends Document {
  email: string;

  otpHash: string;

  expiresAt: Date;

  attempts: number;

  firstRequestedAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

const otpSchema =
  new Schema<IOtp>(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      otpHash: {
        type: String,
        required: true,
      },

      expiresAt: {
        type: Date,
        required: true,
      },

      attempts: {
        type: Number,
        default: 0,
      },

      firstRequestedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    },
  );

/* ====================================================== */
/* INDEXES */
/* ====================================================== */

otpSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

otpSchema.index({
  email: 1,
});

export const OtpModel =
  mongoose.model<IOtp>(
    "Otp",
    otpSchema,
  );



  
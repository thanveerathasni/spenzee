



import {
  Schema,
  model,
  Types,
  Document,
} from "mongoose";

export interface IResetPasswordToken
  extends Document {
  userId: Types.ObjectId;

  tokenHash: string;

  expiresAt: Date;

  createdAt: Date;
}

const resetPasswordTokenSchema =
  new Schema<IResetPasswordToken>(
    {
      userId: {
        type:
          Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      tokenHash: {
        type: String,

        required: true,

        unique: true,

        index: true,
      },

      expiresAt: {
        type: Date,

        required: true,

        index: true,
      },
    },
    {
      timestamps: {
        createdAt: true,

        updatedAt: false,
      },
    },
  );

/* ====================================================== */
/* TTL AUTO CLEANUP */
/* ====================================================== */

resetPasswordTokenSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  },
);

export const ResetPasswordTokenModel =
  model<IResetPasswordToken>(
    "ResetPasswordToken",
    resetPasswordTokenSchema,
  );
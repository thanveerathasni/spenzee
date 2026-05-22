import {
  Document,
  model,
  Schema,
} from "mongoose";

import {
  ROLES,
  Role,
} from "../shared/constants/roles";

export interface IUser
  extends Document {
  name?: string;

  email: string;

  password: string | null;

  role: Role;

  isVerified: boolean;

  isActive: boolean;

  phone?: string;

  profilePicture?: string;

  gender?: string;

  dob?: Date;

  occupation?: string;

  bio?: string;

  provider?:
    | "google"
    | "local";

  createdAt: Date;

  updatedAt: Date;
}

const userSchema =
  new Schema<IUser>(
    {
      name: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        default: null,
        select: false,
      },

      role: {
        type: String,
        enum:
          Object.values(
            ROLES,
          ),
        default:
          ROLES.USER,
        immutable: true,
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

      profilePicture: {
        type: String,
        trim: true,
      },

      gender: {
        type: String,
        trim: true,
      },

      dob: {
        type: Date,
      },

      occupation: {
        type: String,
        trim: true,
      },

      bio: {
        type: String,
        trim: true,
        maxlength: 500,
      },

      provider: {
        type: String,
        enum: [
          "google",
          "local",
        ],
        default: "local",
      },
    },
    {
      timestamps: true,
    },
  );

/* ====================================================== */
/* INDEXES */
/* ====================================================== */

userSchema.index({
  email: 1,
});

userSchema.index({
  isActive: 1,
});

userSchema.index({
  role: 1,
});

userSchema.index({
  createdAt: -1,
});

export const UserModel =
  model<IUser>(
    "User",
    userSchema,
  );
import { injectable } from "inversify";

import {
  IOtp,
  OtpModel,
} from "../models/OtpModel";

import {
  IOtpRecord,
  IOtpRepository,
} from "../types/repositories/IOtpRepository";

@injectable()
export class OtpRepository
  implements IOtpRepository
{
  /* ====================================================== */
  /* CREATE */
  /* ====================================================== */

  async create(
    email: string,
    otpHash: string,
    expiresAt: Date,
  ): Promise<IOtpRecord> {
    const otp =
      await OtpModel.create({
        email,

        otpHash,

        expiresAt,

        attempts: 0,

        firstRequestedAt:
          new Date(),
      });

    return this.mapToRecord(
      otp,
    );
  }

  /* ====================================================== */
  /* FIND */
  /* ====================================================== */

  async findByEmail(
    email: string,
  ): Promise<IOtpRecord | null> {
    const otp =
      await OtpModel.findOne({
        email,
      }).exec();

    if (!otp) {
      return null;
    }

    return this.mapToRecord(
      otp,
    );
  }

  /* ====================================================== */
  /* UPDATE OTP */
  /* ====================================================== */

  async updateOtp(
    email: string,
    otpHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await OtpModel.findOneAndUpdate(
      { email },
      {
        otpHash,

        expiresAt,

        attempts: 0,

        firstRequestedAt:
          new Date(),
      },
      {
        upsert: true,

        new: true,
      },
    ).exec();
  }

  /* ====================================================== */
  /* ATTEMPTS */
  /* ====================================================== */

  async incrementAttempts(
    email: string,
  ): Promise<void> {
    await OtpModel.updateOne(
      { email },
      {
        $inc: {
          attempts: 1,
        },
      },
    ).exec();
  }

  async resetAttempts(
    email: string,
  ): Promise<void> {
    await OtpModel.updateOne(
      { email },
      {
        attempts: 0,
      },
    ).exec();
  }

  /* ====================================================== */
  /* DELETE */
  /* ====================================================== */

  async deleteByEmail(
    email: string,
  ): Promise<void> {
    await OtpModel.deleteOne({
      email,
    }).exec();
  }

  /* ====================================================== */
  /* MAPPER */
  /* ====================================================== */

  private mapToRecord(
    otp: IOtp,
  ): IOtpRecord {
    return {
      email: otp.email,

      otpHash:
        otp.otpHash,

      expiresAt:
        otp.expiresAt,

      attempts:
        otp.attempts,

      createdAt:
        otp.createdAt,

      firstRequestedAt:
        otp.firstRequestedAt,
    };
  }
}
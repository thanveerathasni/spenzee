import { injectable } from "inversify";
import { IOtpRepository } from "../types/repositories/IOtpRepository";
import { OtpModel } from "../models/OtpModel";

@injectable()
export class OtpRepository implements IOtpRepository {

  async create(
    email: string,
    otpHash: string,
    expiresAt: Date
  ): Promise<void> {
    await OtpModel.create({ email, otpHash, expiresAt });
  }

  async findByEmail(email: string) {
    return OtpModel.findOne({ email }).lean();
  }

  async deleteByEmail(email: string): Promise<void> {
    await OtpModel.deleteOne({ email });
  }

  async incrementAttempts(email: string): Promise<void> {
    await OtpModel.updateOne(
      { email },
      { $inc: { attempts: 1 } }
    );
  }

  async updateOtp(
    email: string,
    otpHash: string,
    expiresAt: Date
  ): Promise<void> {
    await OtpModel.updateOne(
      { email },
      { otpHash, expiresAt }
    );
  }
  async resetAttempts(email: string): Promise<void> {
  await OtpModel.updateOne(
    { email },
    {
      attempts: 0,
      firstRequestedAt: new Date()
    }
  );
}

}

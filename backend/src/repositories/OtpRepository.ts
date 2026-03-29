import { injectable } from "inversify";
import { OtpModel } from "../models/OtpModel";

@injectable()
export class OtpRepository {
  async create(email: string, otpHash: string, expiresAt: Date) {
    return OtpModel.create({ email, otpHash, expiresAt });
  }

  async findByEmail(email: string) {
    return OtpModel.findOne({ email });
  }

  async updateOtp(email: string, otpHash: string, expiresAt: Date) {
    return OtpModel.findOneAndUpdate(
      { email },
      { otpHash, expiresAt },
      { upsert: true }
    );
  }

  async deleteByEmail(email: string) {
    await OtpModel.deleteOne({ email });
  }
}
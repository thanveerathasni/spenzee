import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IProvider } from "../../models/Provider.model";
import { HTTP_STATUS } from "../../shared/constants/httpStatus";
import { ProviderDTO } from "../../shared/dto/provider/provider.dto";
import { AppError } from "../../shared/errors/AppError";
import { ProviderMapper } from "../../shared/mapper/provider/ProviderMapper";
import { IProviderRepository } from "../../types/repositories/provider/IProviderRepository";
import { OtpService } from "../otp.service";

@injectable()
export class ProviderService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _repo: IProviderRepository,

    @inject(TYPES.OtpService)
    private readonly _otpService: OtpService
  ) {}

  /* ================= PROFILE ================= */

  async updateProfile(
    providerId: string,
    data: Partial<IProvider>
  ): Promise<ProviderDTO | null> {
    const updated = await this._repo.updateById(providerId, data);
    return updated ? ProviderMapper.toDTO(updated) : null;
  }

  /* ================= EMAIL CHANGE ================= */

  async requestEmailChange(
    providerId: string,
    newEmail: string
  ): Promise<void> {
    const existing = await this._repo.findByEmail(newEmail);

    if (existing) {
      throw new AppError(
        "Email already in use",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._otpService.sendOtp(newEmail);
  }
async getProfile(providerId: string): Promise<ProviderDTO | null> {
  const provider = await this._repo.findById(providerId);
  return provider ? ProviderMapper.toDTO(provider) : null;
}


  async verifyEmailChange(
    providerId: string,
    newEmail: string,
    otp: string
  ): Promise<ProviderDTO | null> {
    await this._otpService.verifyOtp(newEmail, otp);

    const updated = await this._repo.updateById(providerId, {
      email: newEmail,
    });

    return updated ? ProviderMapper.toDTO(updated) : null;
  }
}
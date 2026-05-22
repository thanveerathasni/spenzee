import { inject, injectable } from "inversify";

import { TYPES } from "../../di/types";

import { IProvider } from "../../models/Provider.model";

import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";

import { ProviderDTO } from "../../shared/dto/provider/provider.dto";

import {
  BadRequestError,
  UnauthorizedError,
} from "../../shared/errors/errors";

import { logger } from "../../shared/logger/logger";

import { ProviderMapper } from "../../shared/mapper/provider/ProviderMapper";

import { IProviderRepository } from "../../types/repositories/provider/IProviderRepository";

import { IMailService } from "../../types/services/IMailService";

import { OtpService } from "../otp.service";

import { DocumentUploadService } from "../upload/DocumentUploadService";

@injectable()
export class ProviderService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _repo: IProviderRepository,

    @inject(TYPES.OtpService)
    private readonly _otpService: OtpService,

    @inject(TYPES.MailService)
    private readonly _mailService: IMailService,

    @inject(TYPES.DocumentUploadService)
    private readonly _documentUploadService: DocumentUploadService,
  ) {}

  /* ====================================================== */
  /* PROFILE */
  /* ====================================================== */

  async getProfile(
    providerId: string,
  ): Promise<ProviderDTO> {
    const provider =
      await this._repo.findById(
        providerId,
      );

    if (!provider) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    logger.info(
      LOG_MESSAGES.PROVIDER
        .DASHBOARD_ACCESSED,
      {
        providerId,
      },
    );

    return ProviderMapper.toDTO(
      provider,
    );
  }

  async updateProfile(
    providerId: string,
    data: Partial<IProvider>,
  ): Promise<ProviderDTO> {
    const updated =
      await this._repo.updateById(
        providerId,
        data,
      );

    if (!updated) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    logger.info(
      LOG_MESSAGES.USER
        .PROFILE_UPDATED,
      {
        providerId,
      },
    );

    return ProviderMapper.toDTO(
      updated,
    );
  }

  async acceptTerms(
    providerId: string,
  ): Promise<ProviderDTO> {
    const updated =
      await this._repo.updateById(
        providerId,
        {
          hasAcceptedTerms: true,
        },
      );

    if (!updated) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    logger.info(
      LOG_MESSAGES.PROVIDER
        .DASHBOARD_ACCESSED,
      {
        providerId,
        acceptedTerms: true,
      },
    );

    return ProviderMapper.toDTO(
      updated,
    );
  }

  /* ====================================================== */
  /* PROFILE IMAGE */
  /* ====================================================== */

  async updateProfileImage(
    providerId: string,
    file: Express.Multer.File,
  ): Promise<ProviderDTO> {
    if (!file) {
      throw new BadRequestError(
        ERROR_MESSAGES.USER
          .IMAGE_FILE_REQUIRED,
      );
    }

    const imageUrl =
      await this._documentUploadService.uploadDocument(
        file,
        "spenzee/provider-profile-images",
      );

    const updated =
      await this._repo.updateById(
        providerId,
        {
          profileImage: imageUrl,
        },
      );

    if (!updated) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    logger.info(
      LOG_MESSAGES.USER
        .PROFILE_IMAGE_UPLOADED,
      {
        providerId,
      },
    );

    return ProviderMapper.toDTO(
      updated,
    );
  }

  async removeProfileImage(
    providerId: string,
  ): Promise<ProviderDTO> {
    const updated =
      await this._repo.updateById(
        providerId,
        {
          profileImage: "",
        },
      );

    if (!updated) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    logger.info(
      LOG_MESSAGES.USER
        .PROFILE_IMAGE_REMOVED,
      {
        providerId,
      },
    );

    return ProviderMapper.toDTO(
      updated,
    );
  }

  /* ====================================================== */
  /* EMAIL CHANGE */
  /* ====================================================== */

  async requestEmailChange(
    providerId: string,
    newEmail: string,
  ): Promise<void> {
    const existingProvider =
      await this._repo.findByEmail(
        newEmail,
      );

    if (existingProvider) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .EMAIL_ALREADY_IN_USE,
      );
    }

    await this._otpService.sendOtp(
      newEmail,
      this._mailService,
    );

    logger.info(
      LOG_MESSAGES.PROVIDER
        .EMAIL_CHANGE,
      {
        providerId,
        newEmail,
      },
    );
  }

  async verifyEmailChange(
    providerId: string,
    newEmail: string,
    otp: string,
  ): Promise<ProviderDTO> {
    await this._otpService.verifyOtp(
      newEmail,
      otp,
    );

    const updated =
      await this._repo.updateById(
        providerId,
        {
          email: newEmail,
        },
      );

    if (!updated) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .PROVIDER_NOT_FOUND,
      );
    }

    logger.info(
      LOG_MESSAGES.PROVIDER
        .EMAIL_UPDATED,
      {
        providerId,
        newEmail,
      },
    );

    return ProviderMapper.toDTO(
      updated,
    );
  }
}




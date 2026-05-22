import {
  inject,
  injectable,
} from "inversify";

import { TYPES } from "../../di/types";

import {
  ERROR_MESSAGES,
} from "../../shared/constants/errorMessages";

import {
  LOG_MESSAGES,
} from "../../shared/constants/logMessages";

import { UserProfileDTO } from "../../shared/dto/user/userProfile.dto";

import {
  BadRequestError,
  UnauthorizedError,
} from "../../shared/errors/errors";

import { logger } from "../../shared/logger/logger";

import { UserMapper } from "../../shared/mapper/user/UserMapper";

import { IUserRepository } from "../../types/repositories/user/IUserRepository";

import { DocumentUploadService } from "../upload/DocumentUploadService";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.DocumentUploadService)
    private readonly _documentUploadService: DocumentUploadService,
  ) {}

  /* ====================================================== */
  /* PROFILE */
  /* ====================================================== */

  async getProfile(
    userId: string,
  ): Promise<UserProfileDTO> {
    logger.info(
      LOG_MESSAGES.USER
        .PROFILE_FETCHED,
      { userId },
    );

    const user =
      await this._userRepository.findById(
        userId,
      );

    if (!user) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .USER_NOT_FOUND,
      );
    }

    return UserMapper.toProfileDTO(
      user,
    );
  }

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      phone?: string;
      gender?: string;
      dob?: Date;
      occupation?: string;
      bio?: string;
    },
  ): Promise<UserProfileDTO> {
    logger.info(
      LOG_MESSAGES.USER
        .PROFILE_UPDATED,
      { userId },
    );

    const updatedUser =
      await this._userRepository.updateById(
        userId,
        data,
      );

    if (!updatedUser) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .USER_NOT_FOUND,
      );
    }

    return UserMapper.toProfileDTO(
      updatedUser,
    );
  }

  /* ====================================================== */
  /* PROFILE IMAGE */
  /* ====================================================== */

  async updateProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UserProfileDTO> {
    if (!file) {
      throw new BadRequestError(
        ERROR_MESSAGES.USER
          .IMAGE_FILE_REQUIRED,
      );
    }

    const imageUrl =
      await this._documentUploadService.uploadDocument(
        file,
        "spenzee/user-profile-images",
      );

    const updatedUser =
      await this._userRepository.updateById(
        userId,
        {
          profilePicture:
            imageUrl,
        },
      );

    if (!updatedUser) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .USER_NOT_FOUND,
      );
    }

    logger.info(
      LOG_MESSAGES.USER
        .PROFILE_IMAGE_UPLOADED,
      { userId },
    );

    return UserMapper.toProfileDTO(
      updatedUser,
    );
  }

  async removeProfileImage(
    userId: string,
  ): Promise<UserProfileDTO> {
    const updatedUser =
      await this._userRepository.updateById(
        userId,
        {
          profilePicture:
            "",
        },
      );

    if (!updatedUser) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .USER_NOT_FOUND,
      );
    }

    logger.info(
      LOG_MESSAGES.USER
        .PROFILE_IMAGE_REMOVED,
      { userId },
    );

    return UserMapper.toProfileDTO(
      updatedUser,
    );
  }

  /* ====================================================== */
  /* EMAIL */
  /* ====================================================== */

  async updateEmail(
    userId: string,
    newEmail: string,
  ): Promise<void> {
    const existing =
      await this._userRepository.findByEmail(
        newEmail,
      );

    if (existing) {
      throw new BadRequestError(
        ERROR_MESSAGES.AUTH
          .EMAIL_ALREADY_IN_USE,
      );
    }

    const updatedUser =
      await this._userRepository.updateById(
        userId,
        {
          email: newEmail,
        },
      );

    if (!updatedUser) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .USER_NOT_FOUND,
      );
    }

    logger.info(
      LOG_MESSAGES.AUTH
        .EMAIL_CHANGE,
      {
        userId,
        newEmail,
      },
    );
  }
}
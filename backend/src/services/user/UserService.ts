import { Express  } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { uploadToCloudinary } from "../../services/cloudinaryService";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { UserProfileDTO } from "../../shared/dto/user/userProfile.dto";
import { UnauthorizedError } from "../../shared/errors/errors";
import { logger } from "../../shared/logger/logger";
import { UserMapper } from "../../shared/mapper/user/UserMapper";
import { IUserRepository } from "../../types/repositories/user/IUserRepository";
// import { uploadToCloudinary } from "../cloudinaryService";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository
  ) {}

  async getProfile(userId: string): Promise<UserProfileDTO> {
    logger.info(LOG_MESSAGES.AUTH.LOGIN_ATTEMPT, { userId });

    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    return UserMapper.toProfileDTO(user);
  }

  async updateProfile(
    userId: string,
    data: { email?: string }
  ): Promise<UserProfileDTO> {
    logger.info(LOG_MESSAGES.AUTH.LOGIN_ATTEMPT, { userId });

    const updatedUser = await this._userRepository.update(
      { _id: userId },
      data
    );

    if (!updatedUser) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    return UserMapper.toProfileDTO(updatedUser);
  }

  async updateProfileImage(
    userId: string,
    file: Express.Multer.File
  ): Promise<UserProfileDTO> {
    if (!file) {
      throw new UnauthorizedError("Image file required");
    }

    const imageUrl = await uploadToCloudinary(file.buffer);

    const updatedUser = await this._userRepository.updateById(userId, {
      profileImage: imageUrl,
    });

    if (!updatedUser) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    return UserMapper.toProfileDTO(updatedUser);
  }

async updateEmail(userId: string, newEmail: string): Promise<void> {
  const existing = await this._userRepository.findByEmail(newEmail);

  if (existing) {
    throw new Error("Email already in use");
  }

  await this._userRepository.updateById(userId, {
    email: newEmail,
  });
}

}
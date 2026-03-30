import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../di/types";
import { uploadToCloudinary } from "../../services/cloudinaryService";

import { UserService } from "../../services/user/UserService";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_API_KEY!,
  api_secret: process.env.CLOUD_API_SECRET!,
});

export default cloudinary;
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages";

import { UnauthorizedError } from "../../shared/errors/errors";
import { logger } from "../../shared/logger/logger";
import { sendResponse } from "../../shared/utils/sendResponse";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService)
    private readonly _userService: UserService
  ) {}

  async getProfile(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    logger.info(LOG_MESSAGES.AUTH.LOGIN_ATTEMPT, { userId });

    const data = await this._userService.getProfile(userId);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
      data,
    });
  }

async updateProfile(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }

  const data = await this._userService.updateProfile(userId, req.body);

  return sendResponse({
    res,
    message: SUCCESS_MESSAGES.USER.PROFILE_UPDATED,
    data,
  });
}

async uploadProfileImage(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
  }

  if (!req.file) {
    throw new UnauthorizedError("Image file required");
  }

  const imageUrl = await uploadToCloudinary(req.file.buffer);

  const data = await this._userService.updateProfileImage(userId, imageUrl);

  return sendResponse({
    res,
    message: SUCCESS_MESSAGES.USER.PROFILE_UPDATED,
    data,
  });
}





}

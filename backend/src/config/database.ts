import mongoose from "mongoose";
import { AppError } from "../shared/errors/AppError";
import { HTTP_STATUS } from "../shared/constants/httpStatus";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";

export const connectDatabase = async (
  mongoUri: string | undefined
): Promise<void> => {
  if (!mongoUri) {
    throw new AppError(
      ERROR_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  await mongoose.connect(mongoUri);
};


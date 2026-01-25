import mongoose from "mongoose";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { ERROR_MESSAGES } from "../constants/errorMessages";

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


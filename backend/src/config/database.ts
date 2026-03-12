import mongoose from "mongoose";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
import { HTTP_STATUS } from "../shared/constants/httpStatus";
import { AppError } from "../shared/errors/AppError";

export const connectDatabase = async (mongoUri: string | undefined): Promise<void> => {
  if (!mongoUri) {
    throw new AppError(
      ERROR_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }

  await mongoose.connect(mongoUri);
};

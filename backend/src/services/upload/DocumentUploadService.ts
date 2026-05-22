import { injectable } from "inversify";
import cloudinary from "../../config/cloudinary";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { logger } from "../../shared/logger/logger";

@injectable()
export class DocumentUploadService {
  async uploadDocument(file: Express.Multer.File, folder: string): Promise<string> {
    logger.info(LOG_MESSAGES.VERIFICATION.DOCUMENT_UPLOAD_STARTED, {
      folder,
      mimetype: file.mimetype,
      size: file.size,
    });

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            logger.error(LOG_MESSAGES.VERIFICATION.DOCUMENT_UPLOAD_FAILED, {
              folder,
              message: error.message,
            });
            reject(error);
            return;
          }

          if (!result) {
            logger.error(LOG_MESSAGES.VERIFICATION.DOCUMENT_UPLOAD_FAILED, { folder });
            reject(new Error(ERROR_MESSAGES.VERIFICATION.UPLOAD_FAILED));
            return;
          }

          logger.info(LOG_MESSAGES.VERIFICATION.DOCUMENT_UPLOAD_COMPLETED, {
            folder,
            publicId: result.public_id,
          });
          resolve(result.secure_url);
        },
      );

      stream.end(file.buffer);
    });
  }
}

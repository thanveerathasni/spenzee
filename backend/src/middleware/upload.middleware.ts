import multer from "multer";
import { ERROR_MESSAGES } from "../shared/constants/errorMessages";
import { BadRequestError } from "../shared/errors/errors";

const storage = multer.memoryStorage();
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedDocumentMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const allowedStatementMimeTypes = new Set([
  "application/pdf",
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

export const upload = multer({
  storage,
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new BadRequestError(ERROR_MESSAGES.USER.INVALID_IMAGE_TYPE));
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const documentUpload = multer({
  storage,
  fileFilter: (_req, file, callback) => {
    if (!allowedDocumentMimeTypes.has(file.mimetype)) {
      callback(new BadRequestError(ERROR_MESSAGES.VERIFICATION.INVALID_DOCUMENT_TYPE));
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const bankStatementUpload = multer({
  storage,
  fileFilter: (_req, file, callback) => {
    if (!allowedStatementMimeTypes.has(file.mimetype)) {
      callback(new BadRequestError("Only PDF, CSV, and Excel bank statements are supported"));
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: 15 * 1024 * 1024,
    files: 6,
  },
});

import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../di/types";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { NOTIFICATION_CONTENT, NOTIFICATION_TYPES } from "../../shared/constants/notification";
import { ROLES } from "../../shared/constants/roles";
import {
  USER_DOCUMENT_TYPES,
  UserDocumentType,
  VERIFICATION_UPLOAD_FOLDERS,
  VERIFICATION_STATUS,
  VerificationStatus,
} from "../../shared/constants/verification";
import { UserVerificationDTO } from "../../shared/dto/verification/userVerification.dto";
import { BadRequestError } from "../../shared/errors/errors";
import { logger } from "../../shared/logger/logger";
import { UserVerificationMapper } from "../../shared/mapper/verification/UserVerificationMapper";
import { IUserVerificationRepository } from "../../types/repositories/verification/IUserVerificationRepository";
import { DocumentUploadService } from "../upload/DocumentUploadService";
import { NotificationService } from "../notification/NotificationService";

@injectable()
export class UserVerificationService {
  constructor(
    @inject(TYPES.UserVerificationRepository)
    private readonly _userVerificationRepository: IUserVerificationRepository,

    @inject(TYPES.DocumentUploadService)
    private readonly _documentUploadService: DocumentUploadService,

    @inject(TYPES.NotificationService)
    private readonly _notificationService: NotificationService,
  ) {}

  async submit(
    userId: string,
    documentType: UserDocumentType,
    frontDocument: Express.Multer.File,
    backDocument?: Express.Multer.File,
  ): Promise<UserVerificationDTO> {
    if (!Object.values(USER_DOCUMENT_TYPES).includes(documentType)) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.INVALID_DOCUMENT_TYPE);
    }

    const latest = await this._userVerificationRepository.findLatestByUserId(userId);

    if (latest?.verificationStatus === VERIFICATION_STATUS.PENDING) {
      logger.warn(LOG_MESSAGES.VERIFICATION.BLOCKED_UPLOAD_ATTEMPT, { userId });
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.PENDING_EXISTS);
    }

    if (latest?.verificationStatus === VERIFICATION_STATUS.APPROVED) {
      logger.warn(LOG_MESSAGES.VERIFICATION.BLOCKED_UPLOAD_ATTEMPT, { userId });
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.APPROVED_EXISTS);
    }

    const frontDocumentUrl = await this._documentUploadService.uploadDocument(
      frontDocument,
      VERIFICATION_UPLOAD_FOLDERS.USER,
    );
    const backDocumentUrl = backDocument
      ? await this._documentUploadService.uploadDocument(backDocument, VERIFICATION_UPLOAD_FOLDERS.USER)
      : undefined;

    const verification = await this._userVerificationRepository.create({
      userId: new Types.ObjectId(userId),
      documentType,
      frontDocumentUrl,
      backDocumentUrl,
    });

    logger.info(
      latest?.verificationStatus === VERIFICATION_STATUS.REJECTED
        ? LOG_MESSAGES.USER.VERIFICATION_REUPLOADED
        : LOG_MESSAGES.VERIFICATION.USER_UPLOADED,
      { userId, verificationId: verification._id.toString() },
    );

    await this._notificationService.create({
      recipientId: userId,
      recipientRole: ROLES.USER,
      title: NOTIFICATION_CONTENT.USER_VERIFICATION_SUBMITTED.TITLE,
      message: NOTIFICATION_CONTENT.USER_VERIFICATION_SUBMITTED.MESSAGE,
      notificationType: NOTIFICATION_TYPES.VERIFICATION_SUBMITTED,
    });

    await this._notificationService.notifyAdmins(
      NOTIFICATION_CONTENT.ADMIN_USER_VERIFICATION.TITLE,
      NOTIFICATION_CONTENT.ADMIN_USER_VERIFICATION.MESSAGE,
    );

    return UserVerificationMapper.toDTO(verification);
  }

  async getLatest(userId: string): Promise<UserVerificationDTO | null> {
    const verification = await this._userVerificationRepository.findLatestByUserId(userId);
    return verification ? UserVerificationMapper.toDTO(verification) : null;
  }

  async canUploadBankStatement(userId: string): Promise<boolean> {
    const verification = await this._userVerificationRepository.findLatestByUserId(userId);
    const isAllowed = verification?.verificationStatus === VERIFICATION_STATUS.APPROVED;

    if (!isAllowed) {
      logger.warn(LOG_MESSAGES.USER.BANK_UPLOAD_BLOCKED, { userId });
    }

    return isAllowed;
  }

  async listForAdmin(
    status: VerificationStatus | "",
    search: string,
  ): Promise<UserVerificationDTO[]> {
    const verifications = await this._userVerificationRepository.findAll(status, search);
    return verifications.map(UserVerificationMapper.toDTO);
  }

  async getByIdForAdmin(verificationId: string): Promise<UserVerificationDTO> {
    const verification = await this._userVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.NOT_FOUND);
    }

    return UserVerificationMapper.toDTO(verification);
  }

  async approve(verificationId: string, adminId: string): Promise<UserVerificationDTO> {
    const verification = await this._userVerificationRepository.updateReview(
      verificationId,
      VERIFICATION_STATUS.APPROVED,
      adminId,
    );

    if (!verification) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.NOT_FOUND);
    }

    logger.info(LOG_MESSAGES.VERIFICATION.USER_APPROVED, { verificationId, adminId });

    await this._notificationService.create({
      recipientId: verification.userId.toString(),
      recipientRole: ROLES.USER,
      title: NOTIFICATION_CONTENT.USER_VERIFICATION_APPROVED.TITLE,
      message: NOTIFICATION_CONTENT.USER_VERIFICATION_APPROVED.MESSAGE,
      notificationType: NOTIFICATION_TYPES.VERIFICATION_APPROVED,
    });

    return UserVerificationMapper.toDTO(verification);
  }

  async reject(
    verificationId: string,
    adminId: string,
    rejectionReason: string,
  ): Promise<UserVerificationDTO> {
    if (!rejectionReason.trim()) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.REJECTION_REASON_REQUIRED);
    }

    const verification = await this._userVerificationRepository.updateReview(
      verificationId,
      VERIFICATION_STATUS.REJECTED,
      adminId,
      rejectionReason,
    );

    if (!verification) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.NOT_FOUND);
    }

    logger.info(LOG_MESSAGES.VERIFICATION.USER_REJECTED, { verificationId, adminId });

    await this._notificationService.create({
      recipientId: verification.userId.toString(),
      recipientRole: ROLES.USER,
      title: NOTIFICATION_CONTENT.USER_VERIFICATION_REJECTED.TITLE,
      message: rejectionReason,
      notificationType: NOTIFICATION_TYPES.VERIFICATION_REJECTED,
    });

    return UserVerificationMapper.toDTO(verification);
  }
}

import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../di/types";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { NOTIFICATION_CONTENT, NOTIFICATION_TYPES } from "../../shared/constants/notification";
import { ROLES } from "../../shared/constants/roles";
import {
  PROVIDER_LICENSE_TYPES,
  ProviderLicenseType,
  VERIFICATION_UPLOAD_FOLDERS,
  VERIFICATION_STATUS,
  VerificationStatus,
} from "../../shared/constants/verification";
import { ProviderVerificationDTO } from "../../shared/dto/verification/providerVerification.dto";
import { BadRequestError } from "../../shared/errors/errors";
import { logger } from "../../shared/logger/logger";
import { ProviderVerificationMapper } from "../../shared/mapper/verification/ProviderVerificationMapper";
import { IProviderVerificationRepository } from "../../types/repositories/verification/IProviderVerificationRepository";
import { NotificationService } from "../notification/NotificationService";
import { DocumentUploadService } from "../upload/DocumentUploadService";

@injectable()
export class ProviderVerificationService {
  constructor(
    @inject(TYPES.ProviderVerificationRepository)
    private readonly _providerVerificationRepository: IProviderVerificationRepository,

    @inject(TYPES.DocumentUploadService)
    private readonly _documentUploadService: DocumentUploadService,

    @inject(TYPES.NotificationService)
    private readonly _notificationService: NotificationService,
  ) {}

  async submit(
    providerId: string,
    licenseType: ProviderLicenseType,
    document: Express.Multer.File,
  ): Promise<ProviderVerificationDTO> {
    if (!Object.values(PROVIDER_LICENSE_TYPES).includes(licenseType)) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.INVALID_LICENSE_TYPE);
    }

    const latest = await this._providerVerificationRepository.findLatestByProviderId(providerId);

    if (latest?.verificationStatus === VERIFICATION_STATUS.PENDING) {
      logger.warn(LOG_MESSAGES.VERIFICATION.BLOCKED_UPLOAD_ATTEMPT, { providerId });
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.PENDING_EXISTS);
    }

    if (latest?.verificationStatus === VERIFICATION_STATUS.APPROVED) {
      logger.warn(LOG_MESSAGES.VERIFICATION.BLOCKED_UPLOAD_ATTEMPT, { providerId });
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.APPROVED_EXISTS);
    }

    const documentUrl = await this._documentUploadService.uploadDocument(
      document,
      VERIFICATION_UPLOAD_FOLDERS.PROVIDER,
    );

    const verification = await this._providerVerificationRepository.create({
      providerId: new Types.ObjectId(providerId),
      licenseType,
      documentUrl,
    });

    logger.info(
      latest?.verificationStatus === VERIFICATION_STATUS.REJECTED
        ? LOG_MESSAGES.PROVIDER.VERIFICATION_REUPLOADED
        : LOG_MESSAGES.VERIFICATION.PROVIDER_UPLOADED,
      {
      providerId,
      verificationId: verification._id.toString(),
      },
    );

    await this._notificationService.create({
      recipientId: providerId,
      recipientRole: ROLES.PROVIDER,
      title: NOTIFICATION_CONTENT.PROVIDER_LICENSE_SUBMITTED.TITLE,
      message: NOTIFICATION_CONTENT.PROVIDER_LICENSE_SUBMITTED.MESSAGE,
      notificationType: NOTIFICATION_TYPES.PROVIDER_LICENSE_SUBMITTED,
    });

    await this._notificationService.notifyAdmins(
      NOTIFICATION_CONTENT.ADMIN_PROVIDER_VERIFICATION.TITLE,
      NOTIFICATION_CONTENT.ADMIN_PROVIDER_VERIFICATION.MESSAGE,
    );

    return ProviderVerificationMapper.toDTO(verification);
  }

  async getLatest(providerId: string): Promise<ProviderVerificationDTO | null> {
    const verification = await this._providerVerificationRepository.findLatestByProviderId(providerId);
    return verification ? ProviderVerificationMapper.toDTO(verification) : null;
  }

  async listForAdmin(
    status: VerificationStatus | "",
    search: string,
  ): Promise<ProviderVerificationDTO[]> {
    const verifications = await this._providerVerificationRepository.findAll(status, search);
    return verifications.map(ProviderVerificationMapper.toDTO);
  }

  async getByIdForAdmin(verificationId: string): Promise<ProviderVerificationDTO> {
    const verification = await this._providerVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.NOT_FOUND);
    }

    return ProviderVerificationMapper.toDTO(verification);
  }

  async approve(verificationId: string, adminId: string): Promise<ProviderVerificationDTO> {
    const verification = await this._providerVerificationRepository.updateReview(
      verificationId,
      VERIFICATION_STATUS.APPROVED,
      adminId,
    );

    if (!verification) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.NOT_FOUND);
    }

    logger.info(LOG_MESSAGES.VERIFICATION.PROVIDER_APPROVED, { verificationId, adminId });

    await this._notificationService.create({
      recipientId: verification.providerId.toString(),
      recipientRole: ROLES.PROVIDER,
      title: NOTIFICATION_CONTENT.PROVIDER_LICENSE_APPROVED.TITLE,
      message: NOTIFICATION_CONTENT.PROVIDER_LICENSE_APPROVED.MESSAGE,
      notificationType: NOTIFICATION_TYPES.PROVIDER_LICENSE_APPROVED,
    });

    return ProviderVerificationMapper.toDTO(verification);
  }

  async reject(
    verificationId: string,
    adminId: string,
    rejectionReason: string,
  ): Promise<ProviderVerificationDTO> {
    if (!rejectionReason.trim()) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.REJECTION_REASON_REQUIRED);
    }

    const verification = await this._providerVerificationRepository.updateReview(
      verificationId,
      VERIFICATION_STATUS.REJECTED,
      adminId,
      rejectionReason,
    );

    if (!verification) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.NOT_FOUND);
    }

    logger.info(LOG_MESSAGES.VERIFICATION.PROVIDER_REJECTED, { verificationId, adminId });

    await this._notificationService.create({
      recipientId: verification.providerId.toString(),
      recipientRole: ROLES.PROVIDER,
      title: NOTIFICATION_CONTENT.PROVIDER_LICENSE_REJECTED.TITLE,
      message: rejectionReason,
      notificationType: NOTIFICATION_TYPES.PROVIDER_LICENSE_REJECTED,
    });

    return ProviderVerificationMapper.toDTO(verification);
  }
}

import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages";
import { UnauthorizedError } from "../../shared/errors/errors";
import { sendResponse } from "../../shared/utils/sendResponse";
import { ProviderVerificationService } from "../../services/verification/ProviderVerificationService";
import { UserVerificationService } from "../../services/verification/UserVerificationService";
import { VERIFICATION_STATUS, VerificationStatus } from "../../shared/constants/verification";
import { VerificationRejectDTO } from "../../validators/verification.validator";
import { LOG_MESSAGES } from "../../shared/constants/logMessages";
import { logger } from "../../shared/logger/logger";

@injectable()
export class VerificationAdminController {
  constructor(
    @inject(TYPES.UserVerificationService)
    private readonly _userVerificationService: UserVerificationService,

    @inject(TYPES.ProviderVerificationService)
    private readonly _providerVerificationService: ProviderVerificationService,
  ) {}

  async listUserVerifications(req: Request, res: Response): Promise<Response> {
    const data = await this._userVerificationService.listForAdmin(
      this.getStatus(req),
      String(req.query.search ?? ""),
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.VERIFICATION.FETCHED,
      data,
    });
  }

  async getUserVerification(req: Request, res: Response): Promise<Response> {
    const data = await this._userVerificationService.getByIdForAdmin(req.params.id);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.VERIFICATION.FETCHED,
      data,
    });
  }

  async approveUserVerification(req: Request, res: Response): Promise<Response> {
    const adminId = this.getAdminId(req);
    logger.info(LOG_MESSAGES.VERIFICATION.ADMIN_REVIEW, {
      adminId,
      verificationId: req.params.id,
      action: VERIFICATION_STATUS.APPROVED,
      target: "user",
    });
    const data = await this._userVerificationService.approve(req.params.id, adminId);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.VERIFICATION.APPROVED,
      data,
    });
  }

  async rejectUserVerification(req: Request, res: Response): Promise<Response> {
    const adminId = this.getAdminId(req);
    const dto = req.body as VerificationRejectDTO;
    logger.info(LOG_MESSAGES.VERIFICATION.ADMIN_REVIEW, {
      adminId,
      verificationId: req.params.id,
      action: VERIFICATION_STATUS.REJECTED,
      target: "user",
    });
    const data = await this._userVerificationService.reject(
      req.params.id,
      adminId,
      dto.rejectionReason,
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.VERIFICATION.REJECTED,
      data,
    });
  }

  async listProviderVerifications(req: Request, res: Response): Promise<Response> {
    const data = await this._providerVerificationService.listForAdmin(
      this.getStatus(req),
      String(req.query.search ?? ""),
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.VERIFICATION.FETCHED,
      data,
    });
  }

  async getProviderVerification(req: Request, res: Response): Promise<Response> {
    const data = await this._providerVerificationService.getByIdForAdmin(req.params.id);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.VERIFICATION.FETCHED,
      data,
    });
  }

  async approveProviderVerification(req: Request, res: Response): Promise<Response> {
    const adminId = this.getAdminId(req);
    logger.info(LOG_MESSAGES.VERIFICATION.ADMIN_REVIEW, {
      adminId,
      verificationId: req.params.id,
      action: VERIFICATION_STATUS.APPROVED,
      target: "provider",
    });
    const data = await this._providerVerificationService.approve(req.params.id, adminId);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.VERIFICATION.APPROVED,
      data,
    });
  }

  async rejectProviderVerification(req: Request, res: Response): Promise<Response> {
    const adminId = this.getAdminId(req);
    const dto = req.body as VerificationRejectDTO;
    logger.info(LOG_MESSAGES.VERIFICATION.ADMIN_REVIEW, {
      adminId,
      verificationId: req.params.id,
      action: VERIFICATION_STATUS.REJECTED,
      target: "provider",
    });
    const data = await this._providerVerificationService.reject(
      req.params.id,
      adminId,
      dto.rejectionReason,
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.VERIFICATION.REJECTED,
      data,
    });
  }

  private getAdminId(req: Request): string {
    const adminId = req.user?.id;

    if (!adminId) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    return adminId;
  }

  private getStatus(req: Request): VerificationStatus | "" {
    const status = String(req.query.status ?? "");

    if (Object.values(VERIFICATION_STATUS).includes(status as VerificationStatus)) {
      return status as VerificationStatus;
    }

    return "";
  }
}

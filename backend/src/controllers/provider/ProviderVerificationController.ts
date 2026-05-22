import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import { SUCCESS_MESSAGES } from "../../shared/constants/successMessages";
import { BadRequestError, UnauthorizedError } from "../../shared/errors/errors";
import { sendResponse } from "../../shared/utils/sendResponse";
import { ProviderVerificationService } from "../../services/verification/ProviderVerificationService";
import { ProviderVerificationUploadDTO } from "../../validators/verification.validator";

@injectable()
export class ProviderVerificationController {
  constructor(
    @inject(TYPES.ProviderVerificationService)
    private readonly _providerVerificationService: ProviderVerificationService,
  ) {}

  async submit(req: Request, res: Response): Promise<Response> {
    const providerId = this.getProviderId(req);
    const dto = req.body as ProviderVerificationUploadDTO;

    if (!req.file) {
      throw new BadRequestError(ERROR_MESSAGES.VERIFICATION.FILE_REQUIRED);
    }

    const data = await this._providerVerificationService.submit(
      providerId,
      dto.licenseType,
      req.file,
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.VERIFICATION.SUBMITTED,
      data,
    });
  }

  async getStatus(req: Request, res: Response): Promise<Response> {
    const providerId = this.getProviderId(req);
    const data = await this._providerVerificationService.getLatest(providerId);

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.VERIFICATION.FETCHED,
      data,
    });
  }

  private getProviderId(req: Request): string {
    const providerId = req.user?.id;

    if (!providerId) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    return providerId;
  }
}

import {
  Request,
  Response,
} from "express";

import {
  inject,
  injectable,
} from "inversify";

import {
  TYPES,
} from "../../di/types";

import {
  ERROR_MESSAGES,
} from "../../shared/constants/errorMessages";

import {
  SUCCESS_MESSAGES,
} from "../../shared/constants/successMessages";

import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "../../shared/errors/errors";

import {
  sendResponse,
} from "../../shared/utils/sendResponse";

import {
  UserVerificationService,
} from "../../services/verification/UserVerificationService";

import {
  UserVerificationUploadDTO,
} from "../../validators/verification.validator";

type VerificationFileMap =
  {
    frontDocument?: Express.Multer.File[];

    backDocument?: Express.Multer.File[];
  };

@injectable()
export class UserVerificationController {
  constructor(
    @inject(
      TYPES.UserVerificationService,
    )
    private readonly _userVerificationService: UserVerificationService,
  ) {}

  /* ====================================================== */
  /* SUBMIT */
  /* ====================================================== */

  async submit(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId =
      this.getUserId(req);

    const dto =
      req.body as UserVerificationUploadDTO;

    const files =
      req.files as
        | VerificationFileMap
        | undefined;

    const frontDocument =
      files
        ?.frontDocument?.[0];

    const backDocument =
      files
        ?.backDocument?.[0];

    if (
      !frontDocument
    ) {
      throw new BadRequestError(
        ERROR_MESSAGES
          .VERIFICATION
          .FRONT_FILE_REQUIRED,
      );
    }

    const data =
      await this._userVerificationService.submit(
        userId,
        dto.documentType,
        frontDocument,
        backDocument,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES
          .VERIFICATION
          .SUBMITTED,

      data,
    });
  }

  /* ====================================================== */
  /* GET STATUS */
  /* ====================================================== */

  async getStatus(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId =
      this.getUserId(req);

    const data =
      await this._userVerificationService.getLatest(
        userId,
      );

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES
          .VERIFICATION
          .FETCHED,

      data,
    });
  }

  /* ====================================================== */
  /* BANK ACCESS */
  /* ====================================================== */

  async getBankUploadAccess(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId =
      this.getUserId(req);

    const allowed =
      await this._userVerificationService.canUploadBankStatement(
        userId,
      );

    /* ============================================== */
    /* NOT VERIFIED */
    /* ============================================== */

    if (!allowed) {
      throw new ForbiddenError(
        ERROR_MESSAGES
          .VERIFICATION
          .IDENTITY_APPROVAL_REQUIRED,
      );
    }

    /* ============================================== */
    /* VERIFIED */
    /* ============================================== */

    return sendResponse({
      res,

      message:
        SUCCESS_MESSAGES
          .VERIFICATION
          .BANK_ACCESS_ALLOWED,

      data: {
        allowed,
      },
    });
  }

  /* ====================================================== */
  /* GET USER ID */
  /* ====================================================== */

  private getUserId(
    req: Request,
  ): string {
    const userId =
      req.user?.id;

    if (!userId) {
      throw new UnauthorizedError(
        ERROR_MESSAGES.AUTH
          .ACCESS_DENIED,
      );
    }

    return userId;
  }
}
import {
  Request,
  Response,
} from "express";
import {
  inject,
  injectable,
} from "inversify";

import { TYPES } from "../../di/types";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../shared/errors/errors";
import {
  sendResponse,
} from "../../shared/utils/sendResponse";
import {
  BANK_TRANSACTION_TYPE,
  FINANCIAL_CATEGORY,
} from "../../shared/constants/bankStatement";
import {
  IBankStatementService,
  TransactionFilters,
} from "../../types/services/financial/IBankStatementService";

@injectable()
export class BankStatementController {
  constructor(
    @inject(TYPES.BankStatementService)
    private readonly _bankStatementService:
      IBankStatementService,
  ) {}

  async upload(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId =
      this.getUserId(req);

    const files =
      this.getUploadedFiles(req);

    const data =
      await this._bankStatementService.uploadStatements(
        userId,
        files,
      );

    return sendResponse({
      res,
      message:
        "Bank statements uploaded successfully",
      data,
    });
  }

  async list(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._bankStatementService.getStatements(
        this.getUserId(req),
      );

    return sendResponse({
      res,
      message:
        "Bank statements fetched successfully",
      data,
    });
  }

  async detail(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._bankStatementService.getStatement(
        this.getUserId(req),
        req.params.id,
      );

    return sendResponse({
      res,
      message:
        "Bank statement fetched successfully",
      data,
    });
  }

  async analytics(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const data =
      await this._bankStatementService.getAnalytics(
        this.getUserId(req),
      );

    return sendResponse({
      res,
      message:
        "Financial analytics fetched successfully",
      data,
    });
  }

  async transactions(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const filters =
      this.parseTransactionFilters(req);

    const data =
      await this._bankStatementService.getTransactions(
        this.getUserId(req),
        filters,
      );

    return sendResponse({
      res,
      message:
        "Bank transactions fetched successfully",
      data,
    });
  }

  async delete(
    req: Request,
    res: Response,
  ): Promise<Response> {
    await this._bankStatementService.deleteStatement(
      this.getUserId(req),
      req.params.id,
    );

    return sendResponse({
      res,
      message:
        "Bank statement deleted successfully",
    });
  }

  private getUserId(
    req: Request,
  ): string {
    if (!req.user?.id) {
      throw new UnauthorizedError(
        "Unauthorized",
      );
    }

    return req.user.id;
  }

  private getUploadedFiles(
    req: Request,
  ): Express.Multer.File[] {
    if (
      Array.isArray(req.files)
    ) {
      return req.files;
    }

    if (req.file) {
      return [req.file];
    }

    throw new BadRequestError(
      "Statement file is required",
    );
  }

  private parseTransactionFilters(
    req: Request,
  ): TransactionFilters {
    const page =
      Number(req.query.page) || 1;
    const limit =
      Number(req.query.limit) || 20;
    const search =
      typeof req.query.search ===
      "string"
        ? req.query.search
        : undefined;
    const category =
      typeof req.query.category ===
        "string" &&
      Object.values(
        FINANCIAL_CATEGORY,
      ).includes(
        req.query.category as never,
      )
        ? (req.query.category as TransactionFilters["category"])
        : undefined;
    const type =
      typeof req.query.type ===
        "string" &&
      Object.values(
        BANK_TRANSACTION_TYPE,
      ).includes(
        req.query.type as never,
      )
        ? (req.query.type as TransactionFilters["type"])
        : undefined;

    return {
      page,
      limit:
        limit > 100 ? 100 : limit,
      search,
      category,
      type,
      startDate:
        typeof req.query.startDate ===
        "string"
          ? new Date(
            req.query.startDate,
          )
          : undefined,
      endDate:
        typeof req.query.endDate ===
        "string"
          ? new Date(
            req.query.endDate,
          )
          : undefined,
      minAmount:
        typeof req.query.minAmount ===
        "string"
          ? Number(
            req.query.minAmount,
          )
          : undefined,
      maxAmount:
        typeof req.query.maxAmount ===
        "string"
          ? Number(
            req.query.maxAmount,
          )
          : undefined,
    };
  }
}

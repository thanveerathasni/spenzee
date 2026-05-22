import { createHash } from "crypto";
import { inject, injectable } from "inversify";

import { TYPES } from "../../di/types";
import { IBankStatement } from "../../models/BankStatement.model";
import { IBankTransaction } from "../../models/BankTransaction.model";
import {
  ADMIN_FINANCIAL_ACTION,
  BANK_STATEMENT_STATUS,
  BankStatementStatus,
} from "../../shared/constants/bankStatement";
import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";
import {
  LOG_MESSAGES,
} from "../../shared/constants/logMessages";
import {
  BankStatementMapper,
} from "../../shared/mapper/financial/BankStatementMapper";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../shared/errors/errors";
import {
  logger,
} from "../../shared/logger/logger";
import {
  BankStatementDto,
  FinancialInsightDto,
  TransactionListDto,
} from "../../shared/dto/financial/bankStatement.dto";
import {
  IBankStatementRepository,
} from "../../types/repositories/financial/IBankStatementRepository";
import {
  IBankTransactionRepository,
} from "../../types/repositories/financial/IBankTransactionRepository";
import {
  IFinancialInsightRepository,
} from "../../types/repositories/financial/IFinancialInsightRepository";
import {
  AdminStatementStatusPayload,
  IBankStatementService,
  TransactionFilters,
  UploadBankStatementsResult,
} from "../../types/services/financial/IBankStatementService";
import {
  DocumentUploadService,
} from "../upload/DocumentUploadService";
import {
  BankStatementParser,
} from "./BankStatementParser";
import {
  FinancialAnalyticsEngine,
} from "./FinancialAnalyticsEngine";

const MINIMUM_COVERAGE_DAYS = 90;

@injectable()
export class BankStatementService
  implements IBankStatementService {
  private readonly parser =
    new BankStatementParser();

  private readonly analyticsEngine =
    new FinancialAnalyticsEngine();

  constructor(
    @inject(TYPES.BankStatementRepository)
    private readonly _statementRepository:
      IBankStatementRepository,

    @inject(TYPES.BankTransactionRepository)
    private readonly _transactionRepository:
      IBankTransactionRepository,

    @inject(TYPES.FinancialInsightRepository)
    private readonly _insightRepository:
      IFinancialInsightRepository,

    @inject(TYPES.DocumentUploadService)
    private readonly _documentUploadService:
      DocumentUploadService,
  ) {}

  async uploadStatements(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<UploadBankStatementsResult> {
    if (files.length === 0) {
      throw new BadRequestError(
        "At least one statement file is required",
      );
    }

    const accepted: BankStatementDto[] =
      [];
    const rejected: Array<{
      fileName: string;
      reason: string;
    }> = [];

    for (const file of files) {
      try {
        this.validateFile(file);

        const fileHash =
          this.createFileHash(file);

        const duplicate =
          await this._statementRepository.existsByHash(
            userId,
            fileHash,
          );

        if (duplicate) {
          throw new BadRequestError(
            "Duplicate statement already uploaded",
          );
        }

        const url =
          await this._documentUploadService.uploadDocument(
            file,
            `spenzee/bank-statements/${userId}`,
          );

        const statement =
          await this._statementRepository.create({
            userId,
            originalFileUrl: url,
            originalFileName:
              this.sanitizeFileName(
                file.originalname,
              ),
            fileHash,
            mimeType: file.mimetype,
            fileSize: file.size,
          });

        accepted.push(
          BankStatementMapper.toStatementDto(
            statement,
          ),
        );

        void this.processStatement(
          userId,
          statement._id.toString(),
          file,
        );
      } catch (error: unknown) {
        rejected.push({
          fileName: file.originalname,
          reason:
            error instanceof Error
              ? error.message
              : "Statement rejected",
        });
      }
    }

    return {
      accepted,
      rejected,
    };
  }

  async getStatements(
    userId: string,
  ): Promise<BankStatementDto[]> {
    const statements =
      await this._statementRepository.findByUserId(
        userId,
      );

    return statements.map(
      BankStatementMapper.toStatementDto,
    );
  }

  async getStatement(
    userId: string,
    statementId: string,
  ): Promise<BankStatementDto> {
    const statement =
      await this._statementRepository.findByUserAndId(
        userId,
        statementId,
      );

    if (!statement) {
      throw new UnauthorizedError(
        "Statement not found",
      );
    }

    return BankStatementMapper.toStatementDto(
      statement,
    );
  }

  async getAnalytics(
    userId: string,
  ): Promise<FinancialInsightDto | null> {
    const insight =
      await this._insightRepository.findByUserId(
        userId,
      );

    return insight
      ? BankStatementMapper.toInsightDto(
        insight,
      )
      : null;
  }

  async getTransactions(
    userId: string,
    filters: TransactionFilters,
  ): Promise<TransactionListDto> {
    const page =
      await this._transactionRepository.paginateByUserId(
        userId,
        filters,
      );

    return {
      transactions:
        page.data.map(
          BankStatementMapper.toTransactionDto,
        ),
      total: page.total,
      page: page.page,
      limit: page.limit,
      totalPages: page.totalPages,
    };
  }

  async deleteStatement(
    userId: string,
    statementId: string,
  ): Promise<void> {
    const deleted =
      await this._statementRepository.deleteByUserAndId(
        userId,
        statementId,
      );

    if (!deleted) {
      throw new BadRequestError(
        "Statement not found",
      );
    }

    await this._transactionRepository.deleteByStatementId(
      statementId,
    );

    await this.refreshAnalytics(userId);
  }

  async getAdminStatements(
    userId: string,
    status?: BankStatementStatus,
  ): Promise<BankStatementDto[]> {
    const statements =
      await this._statementRepository.findAdminUserStatements(
        userId,
        status,
      );

    return statements.map(
      BankStatementMapper.toStatementDto,
    );
  }

  async getAdminAnalytics(
    userId: string,
  ): Promise<FinancialInsightDto | null> {
    return this.getAnalytics(userId);
  }

  async updateAdminStatementStatus(
    userId: string,
    statementId: string,
    payload: AdminStatementStatusPayload,
  ): Promise<BankStatementDto> {
    const statement =
      await this._statementRepository.findByUserAndId(
        userId,
        statementId,
      );

    if (!statement) {
      throw new BadRequestError(
        "Statement not found",
      );
    }

    const update =
      this.buildAdminUpdate(payload);

    const updated =
      await this._statementRepository.updateById(
        statement._id.toString(),
        update,
      );

    if (!updated) {
      throw new BadRequestError(
        "Statement not found",
      );
    }

    if (
      payload.action ===
        ADMIN_FINANCIAL_ACTION.FREEZE_ANALYTICS ||
      payload.action ===
        ADMIN_FINANCIAL_ACTION.REJECT_STATEMENT
    ) {
      await this.refreshAnalytics(userId);
    }

    return BankStatementMapper.toStatementDto(
      updated,
    );
  }

  private async processStatement(
    userId: string,
    statementId: string,
    file: Express.Multer.File,
  ): Promise<void> {
    try {
      await this._statementRepository.updateById(
        statementId,
        {
          status:
            BANK_STATEMENT_STATUS.PROCESSING,
        },
      );

      const parsed =
        this.parser.parse(file);

      const coverageDays =
        this.calculateCoverageDays(
          parsed.periodStart,
          parsed.periodEnd,
        );

      if (
        coverageDays <
        MINIMUM_COVERAGE_DAYS
      ) {
        await this.rejectStatement(
          statementId,
          "Minimum 3 months statement required",
          parsed.periodStart,
          parsed.periodEnd,
          parsed.bankName,
          coverageDays,
        );
        return;
      }

      await this._transactionRepository.deleteByStatementId(
        statementId,
      );

      const transactions =
        await this._transactionRepository.insertMany(
          parsed.transactions.map(
            (transaction) => ({
              ...transaction,
              userId,
              statementId,
            }),
          ),
        );

      const recurringIds =
        this.findRecurringIds(
          transactions,
        );

      await this._transactionRepository.updateRecurringByIds(
        recurringIds,
      );

      await this._statementRepository.updateById(
        statementId,
        {
          bankName: parsed.bankName,
          periodStart:
            parsed.periodStart,
          periodEnd: parsed.periodEnd,
          coverageDays,
          status:
            BANK_STATEMENT_STATUS.ANALYZED,
          processedAt: new Date(),
        },
      );

      await this.refreshAnalytics(userId);
    } catch (error: unknown) {
      logger.warn(
        LOG_MESSAGES.AUTH
          .AUTHORIZATION_FAILED,
        {
          userId,
          statementId,
          reason:
            error instanceof Error
              ? error.message
              : "Unknown processing error",
        },
      );

      await this.rejectStatement(
        statementId,
        error instanceof Error
          ? error.message
          : "Statement processing failed",
      );
    }
  }

  private async refreshAnalytics(
    userId: string,
  ): Promise<void> {
    const statements =
      await this._statementRepository.findAnalyzedByUserId(
        userId,
      );

    const transactions =
      await this._transactionRepository.findByUserId(
        userId,
      );

    const analyzedStatementIds =
      new Set(
        statements.map((statement) =>
          statement._id.toString(),
        ),
      );

    const scopedTransactions =
      transactions.filter((transaction) =>
        analyzedStatementIds.has(
          transaction.statementId.toString(),
        ),
      );

    const analytics =
      this.analyticsEngine.analyze(
        scopedTransactions,
      );

    await this._insightRepository.upsertByUserId(
      userId,
      {
        ...analytics,
        statementIds:
          statements.map(
            (statement) =>
              statement._id,
          ),
      },
    );
  }

  private async rejectStatement(
    statementId: string,
    reason: string,
    periodStart?: Date,
    periodEnd?: Date,
    bankName?: string,
    coverageDays?: number,
  ): Promise<void> {
    await this._statementRepository.updateById(
      statementId,
      {
        status:
          BANK_STATEMENT_STATUS.REJECTED,
        rejectionReason: reason,
        periodStart,
        periodEnd,
        bankName,
        coverageDays:
          coverageDays ?? 0,
        processedAt: new Date(),
      },
    );
  }

  private validateFile(
    file: Express.Multer.File,
  ): void {
    const allowedMimeTypes =
      new Set([
        "application/pdf",
        "text/csv",
        "application/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]);

    if (
      !allowedMimeTypes.has(
        file.mimetype,
      )
    ) {
      throw new BadRequestError(
        "Only PDF, CSV, and Excel bank statements are supported",
      );
    }

    if (
      file.size >
      15 * 1024 * 1024
    ) {
      throw new BadRequestError(
        "Statement file must be under 15MB",
      );
    }
  }

  private createFileHash(
    file: Express.Multer.File,
  ): string {
    return createHash("sha256")
      .update(file.buffer)
      .digest("hex");
  }

  private sanitizeFileName(
    fileName: string,
  ): string {
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 120);
  }

  private calculateCoverageDays(
    start?: Date,
    end?: Date,
  ): number {
    if (!start || !end) {
      return 0;
    }

    return Math.ceil(
      (end.getTime() -
        start.getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;
  }

  private findRecurringIds(
    transactions: IBankTransaction[],
  ): string[] {
    const merchantMonths =
      new Map<string, Set<string>>();

    for (const transaction of transactions) {
      const month =
        transaction.transactionDate
          .toISOString()
          .slice(0, 7);

      const months =
        merchantMonths.get(
          transaction.merchant,
        ) ?? new Set<string>();

      months.add(month);
      merchantMonths.set(
        transaction.merchant,
        months,
      );
    }

    return transactions
      .filter((transaction) => {
        const months =
          merchantMonths.get(
            transaction.merchant,
          );

        return Boolean(
          months && months.size > 1,
        );
      })
      .map((transaction) =>
        transaction._id.toString(),
      );
  }

  private buildAdminUpdate(
    payload: AdminStatementStatusPayload,
  ): Partial<IBankStatement> {
    switch (payload.action) {
      case ADMIN_FINANCIAL_ACTION.MARK_SUSPICIOUS:
        return {
          isSuspicious: true,
          adminNote: payload.note,
        };

      case ADMIN_FINANCIAL_ACTION.FREEZE_ANALYTICS:
        return {
          analyticsFrozen: true,
          adminNote: payload.note,
        };

      case ADMIN_FINANCIAL_ACTION.REQUEST_REUPLOAD:
        return {
          status:
            BANK_STATEMENT_STATUS.REJECTED,
          rejectionReason:
            payload.rejectionReason ??
            "Statement reupload requested",
          adminNote: payload.note,
        };

      case ADMIN_FINANCIAL_ACTION.REJECT_STATEMENT:
        return {
          status:
            BANK_STATEMENT_STATUS.REJECTED,
          rejectionReason:
            payload.rejectionReason ??
            "Statement rejected by admin",
          adminNote: payload.note,
        };

      default:
        throw new BadRequestError(
          ERROR_MESSAGES.GENERAL
            .INVALID_REQUEST,
        );
    }
  }
}

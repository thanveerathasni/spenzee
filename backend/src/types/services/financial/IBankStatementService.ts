import {
  AdminFinancialAction,
  BankStatementStatus,
  BankTransactionType,
  FinancialCategory,
} from "../../../shared/constants/bankStatement";
import {
  BankStatementDto,
  FinancialInsightDto,
  TransactionListDto,
} from "../../../shared/dto/financial/bankStatement.dto";

export interface UploadBankStatementsResult {
  accepted: BankStatementDto[];
  rejected: Array<{
    fileName: string;
    reason: string;
  }>;
}

export interface TransactionFilters {
  page: number;
  limit: number;
  search?: string;
  category?: FinancialCategory;
  type?: BankTransactionType;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface AdminStatementStatusPayload {
  action: AdminFinancialAction;
  status?: BankStatementStatus;
  note?: string;
  rejectionReason?: string;
}

export interface IBankStatementService {
  uploadStatements(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<UploadBankStatementsResult>;

  getStatements(
    userId: string,
  ): Promise<BankStatementDto[]>;

  getStatement(
    userId: string,
    statementId: string,
  ): Promise<BankStatementDto>;

  getAnalytics(
    userId: string,
  ): Promise<FinancialInsightDto | null>;

  getTransactions(
    userId: string,
    filters: TransactionFilters,
  ): Promise<TransactionListDto>;

  deleteStatement(
    userId: string,
    statementId: string,
  ): Promise<void>;

  getAdminStatements(
    userId: string,
    status?: BankStatementStatus,
  ): Promise<BankStatementDto[]>;

  getAdminAnalytics(
    userId: string,
  ): Promise<FinancialInsightDto | null>;

  updateAdminStatementStatus(
    userId: string,
    statementId: string,
    payload: AdminStatementStatusPayload,
  ): Promise<BankStatementDto>;
}

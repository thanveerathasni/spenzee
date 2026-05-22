import {
  BankStatementStatus,
  BankTransactionType,
  FinancialCategory,
  InsightSeverity,
} from "../../constants/bankStatement";

export interface BankStatementDto {
  id: string;
  userId: string;
  originalFileUrl: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  bankName: string;
  periodStart?: string;
  periodEnd?: string;
  coverageDays: number;
  status: BankStatementStatus;
  rejectionReason?: string;
  isSuspicious: boolean;
  analyticsFrozen: boolean;
  adminNote?: string;
  processedAt?: string;
  createdAt: string;
}

export interface BankTransactionDto {
  id: string;
  statementId: string;
  transactionDate: string;
  description: string;
  merchant: string;
  referenceId?: string;
  amount: number;
  type: BankTransactionType;
  balance?: number;
  category: FinancialCategory;
  isRecurring: boolean;
}

export interface MonthlySummaryDto {
  month: string;
  income: number;
  expense: number;
  savings: number;
  cashFlow: number;
  transactionCount: number;
}

export interface CategorySummaryDto {
  category: FinancialCategory;
  amount: number;
  percentage: number;
  trend: number;
}

export interface SmartInsightDto {
  title: string;
  description: string;
  severity: InsightSeverity;
}

export interface RiskIndicatorDto {
  key: string;
  label: string;
  severity: InsightSeverity;
  value: number;
}

export interface FinancialInsightDto {
  id: string;
  userId: string;
  statementIds: string[];
  totalIncome: number;
  totalExpense: number;
  savings: number;
  avgMonthlySpend: number;
  averageBalance: number;
  savingsRate: number;
  financialHealthScore: number;
  riskScore: number;
  highestExpenseCategory: string;
  monthlySummaries: MonthlySummaryDto[];
  categorySummaries: CategorySummaryDto[];
  smartInsights: SmartInsightDto[];
  riskIndicators: RiskIndicatorDto[];
  recurringSubscriptions: string[];
  recurringEmis: string[];
  lowBalanceWarnings: number;
  unusualSpikes: number;
  generatedAt: string;
}

export interface TransactionListDto {
  transactions: BankTransactionDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

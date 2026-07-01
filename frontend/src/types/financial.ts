export type BankStatementStatus =
  | "uploaded"
  | "processing"
  | "analyzed"
  | "rejected";

export type BankTransactionType =
  | "debit"
  | "credit";

export type FinancialCategory =
  | "Food"
  | "Travel"
  | "Bills"
  | "Shopping"
  | "Entertainment"
  | "Healthcare"
  | "EMI"
  | "Rent"
  | "Fuel"
  | "Investment"
  | "Salary"
  | "ATM"
  | "Transfer"
  | "Insurance"
  | "Education"
  | "Subscription"
  | "Others";

export type InsightSeverity =
  | "positive"
  | "info"
  | "warning"
  | "critical";

export type AdminFinancialAction =
  | "mark_suspicious"
  | "freeze_analytics"
  | "request_reupload"
  | "reject_statement";

export interface BankStatement {
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

export interface BankTransaction {
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

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  savings: number;
  cashFlow: number;
  transactionCount: number;
}

export interface CategorySummary {
  category: FinancialCategory;
  amount: number;
  percentage: number;
  trend: number;
}

export interface SmartInsight {
  title: string;
  description: string;
  severity: InsightSeverity;
}

export interface RiskIndicator {
  key: string;
  label: string;
  severity: InsightSeverity;
  value: number;
}

export interface FinancialInsight {
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
  monthlySummaries: MonthlySummary[];
  categorySummaries: CategorySummary[];
  smartInsights: SmartInsight[];
  riskIndicators: RiskIndicator[];
  recurringSubscriptions: string[];
  recurringEmis: string[];
  lowBalanceWarnings: number;
  unusualSpikes: number;
  generatedAt: string;
}

export interface UploadBankStatementsResult {
  accepted: BankStatement[];
  rejected: Array<{
    fileName: string;
    reason: string;
  }>;
}

export interface TransactionList {
  transactions: BankTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: FinancialCategory;
  type?: BankTransactionType;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

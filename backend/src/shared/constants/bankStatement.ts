export const BANK_STATEMENT_STATUS = {
  UPLOADED: "uploaded",
  PROCESSING: "processing",
  ANALYZED: "analyzed",
  REJECTED: "rejected",
} as const;

export type BankStatementStatus =
  (typeof BANK_STATEMENT_STATUS)[keyof typeof BANK_STATEMENT_STATUS];

export const BANK_TRANSACTION_TYPE = {
  DEBIT: "debit",
  CREDIT: "credit",
} as const;

export type BankTransactionType =
  (typeof BANK_TRANSACTION_TYPE)[keyof typeof BANK_TRANSACTION_TYPE];

export const FINANCIAL_CATEGORY = {
  FOOD: "Food",
  TRAVEL: "Travel",
  BILLS: "Bills",
  SHOPPING: "Shopping",
  ENTERTAINMENT: "Entertainment",
  HEALTHCARE: "Healthcare",
  EMI: "EMI",
  RENT: "Rent",
  FUEL: "Fuel",
  INVESTMENT: "Investment",
  SALARY: "Salary",
  ATM: "ATM",
  TRANSFER: "Transfer",
  INSURANCE: "Insurance",
  EDUCATION: "Education",
  SUBSCRIPTION: "Subscription",
  OTHERS: "Others",
} as const;

export type FinancialCategory =
  (typeof FINANCIAL_CATEGORY)[keyof typeof FINANCIAL_CATEGORY];

export const INSIGHT_SEVERITY = {
  POSITIVE: "positive",
  INFO: "info",
  WARNING: "warning",
  CRITICAL: "critical",
} as const;

export type InsightSeverity =
  (typeof INSIGHT_SEVERITY)[keyof typeof INSIGHT_SEVERITY];

export const ADMIN_FINANCIAL_ACTION = {
  MARK_SUSPICIOUS: "mark_suspicious",
  FREEZE_ANALYTICS: "freeze_analytics",
  REQUEST_REUPLOAD: "request_reupload",
  REJECT_STATEMENT: "reject_statement",
} as const;

export type AdminFinancialAction =
  (typeof ADMIN_FINANCIAL_ACTION)[keyof typeof ADMIN_FINANCIAL_ACTION];

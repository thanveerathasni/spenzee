import { IBankStatement } from "../../../models/BankStatement.model";
import { IBankTransaction } from "../../../models/BankTransaction.model";
import { IFinancialInsight } from "../../../models/FinancialInsight.model";
import {
  BankStatementDto,
  BankTransactionDto,
  FinancialInsightDto,
} from "../../dto/financial/bankStatement.dto";

const iso = (
  value?: Date,
): string | undefined =>
  value ? value.toISOString() : undefined;

export class BankStatementMapper {
  static toStatementDto(
    statement: IBankStatement,
  ): BankStatementDto {
    return {
      id: statement._id.toString(),
      userId: statement.userId.toString(),
      originalFileUrl:
        statement.originalFileUrl,
      originalFileName:
        statement.originalFileName,
      mimeType: statement.mimeType,
      fileSize: statement.fileSize,
      bankName: statement.bankName,
      periodStart: iso(
        statement.periodStart,
      ),
      periodEnd: iso(
        statement.periodEnd,
      ),
      coverageDays:
        statement.coverageDays,
      status: statement.status,
      rejectionReason:
        statement.rejectionReason,
      isSuspicious:
        statement.isSuspicious,
      analyticsFrozen:
        statement.analyticsFrozen,
      adminNote: statement.adminNote,
      processedAt: iso(
        statement.processedAt,
      ),
      createdAt:
        statement.createdAt.toISOString(),
    };
  }

  static toTransactionDto(
    transaction: IBankTransaction,
  ): BankTransactionDto {
    return {
      id: transaction._id.toString(),
      statementId:
        transaction.statementId.toString(),
      transactionDate:
        transaction.transactionDate.toISOString(),
      description:
        transaction.description,
      merchant: transaction.merchant,
      referenceId:
        transaction.referenceId,
      amount: transaction.amount,
      type: transaction.type,
      balance: transaction.balance,
      category: transaction.category,
      isRecurring:
        transaction.isRecurring,
    };
  }

  static toInsightDto(
    insight: IFinancialInsight,
  ): FinancialInsightDto {
    return {
      id: insight._id.toString(),
      userId: insight.userId.toString(),
      statementIds:
        insight.statementIds.map(
          (statementId) =>
            statementId.toString(),
        ),
      totalIncome: insight.totalIncome,
      totalExpense:
        insight.totalExpense,
      savings: insight.savings,
      avgMonthlySpend:
        insight.avgMonthlySpend,
      averageBalance:
        insight.averageBalance,
      savingsRate: insight.savingsRate,
      financialHealthScore:
        insight.financialHealthScore,
      riskScore: insight.riskScore,
      highestExpenseCategory:
        insight.highestExpenseCategory,
      monthlySummaries:
        insight.monthlySummaries.map(
          (summary) => ({
            month: summary.month,
            income: summary.income,
            expense: summary.expense,
            savings: summary.savings,
            cashFlow: summary.cashFlow,
            transactionCount:
              summary.transactionCount,
          }),
        ),
      categorySummaries:
        insight.categorySummaries.map(
          (summary) => ({
            category: summary.category,
            amount: summary.amount,
            percentage: summary.percentage,
            trend: summary.trend,
          }),
        ),
      smartInsights:
        insight.smartInsights.map(
          (item) => ({
            title: item.title,
            description:
              item.description,
            severity: item.severity,
          }),
        ),
      riskIndicators:
        insight.riskIndicators.map(
          (item) => ({
            key: item.key,
            label: item.label,
            severity: item.severity,
            value: item.value,
          }),
        ),
      recurringSubscriptions:
        insight.recurringSubscriptions,
      recurringEmis:
        insight.recurringEmis,
      lowBalanceWarnings:
        insight.lowBalanceWarnings,
      unusualSpikes: insight.unusualSpikes,
      generatedAt:
        insight.generatedAt.toISOString(),
    };
  }
}

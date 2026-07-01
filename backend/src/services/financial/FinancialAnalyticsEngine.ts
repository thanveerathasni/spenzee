import {
  IBankTransaction,
} from "../../models/BankTransaction.model";
import {
  BANK_TRANSACTION_TYPE,
  FINANCIAL_CATEGORY,
  FinancialCategory,
  INSIGHT_SEVERITY,
} from "../../shared/constants/bankStatement";

interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  savings: number;
  cashFlow: number;
  transactionCount: number;
}

interface CategorySummary {
  category: FinancialCategory;
  amount: number;
  percentage: number;
  trend: number;
}

interface SmartInsight {
  title: string;
  description: string;
  severity:
    (typeof INSIGHT_SEVERITY)[keyof typeof INSIGHT_SEVERITY];
}

interface RiskIndicator {
  key: string;
  label: string;
  severity:
    (typeof INSIGHT_SEVERITY)[keyof typeof INSIGHT_SEVERITY];
  value: number;
}

export interface FinancialAnalyticsResult {
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
}

export class FinancialAnalyticsEngine {
  analyze(
    transactions: IBankTransaction[],
  ): FinancialAnalyticsResult {
    const monthlySummaries =
      this.buildMonthlySummaries(
        transactions,
      );

    const categorySummaries =
      this.buildCategorySummaries(
        transactions,
      );

    const totalIncome =
      this.sumByType(
        transactions,
        BANK_TRANSACTION_TYPE.CREDIT,
      );

    const totalExpense =
      this.sumByType(
        transactions,
        BANK_TRANSACTION_TYPE.DEBIT,
      );

    const balances =
      transactions
        .map((transaction) =>
          transaction.balance,
        )
        .filter(
          (balance): balance is number =>
            balance !== undefined,
        );

    const averageBalance =
      balances.length > 0
        ? this.round(
          balances.reduce(
            (sum, balance) =>
              sum + balance,
            0,
          ) / balances.length,
        )
        : 0;

    const recurring =
      this.detectRecurring(
        transactions,
      );

    const lowBalanceWarnings =
      balances.filter(
        (balance) => balance < 5000,
      ).length;

    const unusualSpikes =
      this.detectSpikes(
        monthlySummaries,
      );

    const savings =
      totalIncome - totalExpense;

    const savingsRate =
      totalIncome > 0
        ? this.round(
          (savings / totalIncome) * 100,
        )
        : 0;

    const riskScore =
      this.calculateRiskScore({
        savingsRate,
        lowBalanceWarnings,
        unusualSpikes,
        recurringEmis:
          recurring.emis.length,
        totalExpense,
        totalIncome,
      });

    const financialHealthScore =
      Math.max(
        0,
        Math.min(
          100,
          this.round(
            100 - riskScore,
          ),
        ),
      );

    return {
      totalIncome:
        this.round(totalIncome),
      totalExpense:
        this.round(totalExpense),
      savings: this.round(savings),
      avgMonthlySpend:
        monthlySummaries.length > 0
          ? this.round(
            totalExpense /
              monthlySummaries.length,
          )
          : 0,
      averageBalance,
      savingsRate,
      financialHealthScore,
      riskScore,
      highestExpenseCategory:
        categorySummaries[0]?.category ??
        FINANCIAL_CATEGORY.OTHERS,
      monthlySummaries,
      categorySummaries,
      smartInsights:
        this.buildInsights(
          monthlySummaries,
          categorySummaries,
          recurring.subscriptions,
          recurring.emis,
          lowBalanceWarnings,
          unusualSpikes,
          savingsRate,
        ),
      riskIndicators:
        this.buildRiskIndicators(
          riskScore,
          lowBalanceWarnings,
          unusualSpikes,
          recurring.emis.length,
        ),
      recurringSubscriptions:
        recurring.subscriptions,
      recurringEmis: recurring.emis,
      lowBalanceWarnings,
      unusualSpikes,
    };
  }

  private sumByType(
    transactions: IBankTransaction[],
    type: string,
  ): number {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === type,
      )
      .reduce(
        (sum, transaction) =>
          sum + transaction.amount,
        0,
      );
  }

  private buildMonthlySummaries(
    transactions: IBankTransaction[],
  ): MonthlySummary[] {
    const map =
      new Map<string, MonthlySummary>();

    for (const transaction of transactions) {
      const month =
        transaction.transactionDate
          .toISOString()
          .slice(0, 7);

      const current =
        map.get(month) ?? {
          month,
          income: 0,
          expense: 0,
          savings: 0,
          cashFlow: 0,
          transactionCount: 0,
        };

      if (
        transaction.type ===
        BANK_TRANSACTION_TYPE.CREDIT
      ) {
        current.income +=
          transaction.amount;
      } else {
        current.expense +=
          transaction.amount;
      }

      current.savings =
        current.income -
        current.expense;
      current.cashFlow =
        current.savings;
      current.transactionCount += 1;

      map.set(month, current);
    }

    return Array.from(map.values())
      .sort((a, b) =>
        a.month.localeCompare(b.month),
      )
      .map((summary) => ({
        ...summary,
        income: this.round(
          summary.income,
        ),
        expense: this.round(
          summary.expense,
        ),
        savings: this.round(
          summary.savings,
        ),
        cashFlow: this.round(
          summary.cashFlow,
        ),
      }));
  }

  private buildCategorySummaries(
    transactions: IBankTransaction[],
  ): CategorySummary[] {
    const debitTransactions =
      transactions.filter(
        (transaction) =>
          transaction.type ===
          BANK_TRANSACTION_TYPE.DEBIT,
      );

    const totalExpense =
      debitTransactions.reduce(
        (sum, transaction) =>
          sum + transaction.amount,
        0,
      );

    const map =
      new Map<FinancialCategory, number>();

    for (const transaction of debitTransactions) {
      map.set(
        transaction.category,
        (map.get(transaction.category) ??
          0) + transaction.amount,
      );
    }

    return Array.from(
      map.entries(),
    )
      .map(([category, amount]) => ({
        category,
        amount: this.round(amount),
        percentage:
          totalExpense > 0
            ? this.round(
              (amount / totalExpense) *
                100,
            )
            : 0,
        trend:
          this.calculateCategoryTrend(
            debitTransactions,
            category,
          ),
      }))
      .sort(
        (a, b) => b.amount - a.amount,
      );
  }

  private calculateCategoryTrend(
    transactions: IBankTransaction[],
    category: FinancialCategory,
  ): number {
    const monthly =
      new Map<string, number>();

    for (const transaction of transactions) {
      if (
        transaction.category !== category
      ) {
        continue;
      }

      const month =
        transaction.transactionDate
          .toISOString()
          .slice(0, 7);

      monthly.set(
        month,
        (monthly.get(month) ?? 0) +
          transaction.amount,
      );
    }

    const values =
      Array.from(monthly.entries())
        .sort(([a], [b]) =>
          a.localeCompare(b),
        )
        .map(([, value]) => value);

    if (values.length < 2) {
      return 0;
    }

    const previous =
      values[values.length - 2];
    const latest =
      values[values.length - 1];

    return previous > 0
      ? this.round(
        ((latest - previous) /
          previous) *
          100,
      )
      : 0;
  }

  private detectRecurring(
    transactions: IBankTransaction[],
  ): {
    subscriptions: string[];
    emis: string[];
  } {
    const merchantMonths =
      new Map<string, Set<string>>();

    for (const transaction of transactions) {
      if (
        transaction.type !==
        BANK_TRANSACTION_TYPE.DEBIT
      ) {
        continue;
      }

      const month =
        transaction.transactionDate
          .toISOString()
          .slice(0, 7);

      const set =
        merchantMonths.get(
          transaction.merchant,
        ) ?? new Set<string>();

      set.add(month);
      merchantMonths.set(
        transaction.merchant,
        set,
      );
    }

    const subscriptions: string[] =
      [];
    const emis: string[] = [];

    for (const [
      merchant,
      months,
    ] of merchantMonths.entries()) {
      if (months.size < 2) {
        continue;
      }

      if (
        merchant.includes("EMI") ||
        merchant.includes("LOAN") ||
        merchant.includes("NACH")
      ) {
        emis.push(merchant);
      } else if (
        merchant.includes("NETFLIX") ||
        merchant.includes("SPOTIFY") ||
        merchant.includes("PRIME") ||
        merchant.includes("HOTSTAR")
      ) {
        subscriptions.push(merchant);
      }
    }

    return {
      subscriptions:
        subscriptions.slice(0, 8),
      emis: emis.slice(0, 8),
    };
  }

  private detectSpikes(
    monthlySummaries: MonthlySummary[],
  ): number {
    if (monthlySummaries.length < 2) {
      return 0;
    }

    let spikes = 0;

    for (
      let index = 1;
      index < monthlySummaries.length;
      index += 1
    ) {
      const previous =
        monthlySummaries[index - 1]
          .expense;
      const current =
        monthlySummaries[index].expense;

      if (
        previous > 0 &&
        current > previous * 1.35
      ) {
        spikes += 1;
      }
    }

    return spikes;
  }

  private calculateRiskScore(
    input: {
      savingsRate: number;
      lowBalanceWarnings: number;
      unusualSpikes: number;
      recurringEmis: number;
      totalExpense: number;
      totalIncome: number;
    },
  ): number {
    let score = 10;

    if (input.savingsRate < 10) {
      score += 25;
    }

    if (
      input.totalExpense >
      input.totalIncome
    ) {
      score += 20;
    }

    score += Math.min(
      20,
      input.lowBalanceWarnings * 3,
    );
    score += Math.min(
      15,
      input.unusualSpikes * 5,
    );
    score += Math.min(
      20,
      input.recurringEmis * 6,
    );

    return Math.min(
      100,
      this.round(score),
    );
  }

  private buildInsights(
    monthlySummaries: MonthlySummary[],
    categorySummaries: CategorySummary[],
    subscriptions: string[],
    emis: string[],
    lowBalanceWarnings: number,
    unusualSpikes: number,
    savingsRate: number,
  ): SmartInsight[] {
    const insights: SmartInsight[] =
      [];

    const topCategory =
      categorySummaries[0];

    if (topCategory) {
      insights.push({
        title:
          `${topCategory.category} leads spending`,
        description:
          `${topCategory.category} accounts for ${topCategory.percentage}% of debit outflow.`,
        severity:
          topCategory.percentage > 35
            ? INSIGHT_SEVERITY.WARNING
            : INSIGHT_SEVERITY.INFO,
      });
    }

    const rising =
      categorySummaries.find(
        (category) =>
          category.trend > 25,
      );

    if (rising) {
      insights.push({
        title:
          `${rising.category} spending increased`,
        description:
          `You spend ${rising.trend}% more on ${rising.category.toLowerCase()} this month.`,
        severity:
          INSIGHT_SEVERITY.WARNING,
      });
    }

    if (subscriptions.length > 0) {
      insights.push({
        title:
          "Recurring subscriptions detected",
        description:
          `${subscriptions.slice(0, 3).join(", ")} appear every month.`,
        severity:
          INSIGHT_SEVERITY.INFO,
      });
    }

    if (emis.length > 0) {
      insights.push({
        title: "Recurring EMIs detected",
        description:
          `${emis.length} recurring loan or EMI patterns were found.`,
        severity:
          INSIGHT_SEVERITY.WARNING,
      });
    }

    if (lowBalanceWarnings > 2) {
      insights.push({
        title:
          "Frequent low balance pattern detected",
        description:
          "Account balance repeatedly dropped below the healthy operating threshold.",
        severity:
          INSIGHT_SEVERITY.CRITICAL,
      });
    }

    if (unusualSpikes > 0) {
      insights.push({
        title:
          "Unusual spending spikes detected",
        description:
          "One or more months show a sharp expense jump compared with the previous month.",
        severity:
          INSIGHT_SEVERITY.WARNING,
      });
    }

    if (savingsRate >= 25) {
      insights.push({
        title: "Savings trend improving",
        description:
          "Your savings rate is above the recommended baseline.",
        severity:
          INSIGHT_SEVERITY.POSITIVE,
      });
    }

    if (
      monthlySummaries.length === 0
    ) {
      insights.push({
        title:
          "Upload statements to unlock insights",
        description:
          "Financial intelligence appears after statement analysis is complete.",
        severity: INSIGHT_SEVERITY.INFO,
      });
    }

    return insights;
  }

  private buildRiskIndicators(
    riskScore: number,
    lowBalanceWarnings: number,
    unusualSpikes: number,
    recurringEmis: number,
  ): RiskIndicator[] {
    return [
      {
        key: "financial_instability",
        label:
          "Financial instability",
        severity:
          riskScore > 65
            ? INSIGHT_SEVERITY.CRITICAL
            : INSIGHT_SEVERITY.INFO,
        value: riskScore,
      },
      {
        key: "low_balance",
        label: "Low balance events",
        severity:
          lowBalanceWarnings > 2
            ? INSIGHT_SEVERITY.WARNING
            : INSIGHT_SEVERITY.INFO,
        value: lowBalanceWarnings,
      },
      {
        key: "spending_spikes",
        label: "Spending spikes",
        severity:
          unusualSpikes > 0
            ? INSIGHT_SEVERITY.WARNING
            : INSIGHT_SEVERITY.INFO,
        value: unusualSpikes,
      },
      {
        key: "debt_indicators",
        label: "Debt indicators",
        severity:
          recurringEmis > 0
            ? INSIGHT_SEVERITY.WARNING
            : INSIGHT_SEVERITY.INFO,
        value: recurringEmis,
      },
    ];
  }

  private round(
    value: number,
  ): number {
    return Math.round(value * 100) / 100;
  }
}

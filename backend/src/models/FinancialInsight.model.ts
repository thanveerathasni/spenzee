import {
  Document,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  FinancialCategory,
  INSIGHT_SEVERITY,
  InsightSeverity,
} from "../shared/constants/bankStatement";

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
  severity: InsightSeverity;
}

interface RiskIndicator {
  key: string;
  label: string;
  severity: InsightSeverity;
  value: number;
}

export interface IFinancialInsight extends Document {
  userId: Types.ObjectId;
  statementIds: Types.ObjectId[];
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
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const nestedSchemaOptions = {
  _id: false,
};

const monthlySummarySchema =
  new Schema<MonthlySummary>(
    {
      month: { type: String, required: true },
      income: { type: Number, required: true },
      expense: { type: Number, required: true },
      savings: { type: Number, required: true },
      cashFlow: { type: Number, required: true },
      transactionCount: { type: Number, required: true },
    },
    nestedSchemaOptions,
  );

const categorySummarySchema =
  new Schema<CategorySummary>(
    {
      category: { type: String, required: true },
      amount: { type: Number, required: true },
      percentage: { type: Number, required: true },
      trend: { type: Number, required: true },
    },
    nestedSchemaOptions,
  );

const smartInsightSchema =
  new Schema<SmartInsight>(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      severity: {
        type: String,
        enum: Object.values(
          INSIGHT_SEVERITY,
        ),
        required: true,
      },
    },
    nestedSchemaOptions,
  );

const riskIndicatorSchema =
  new Schema<RiskIndicator>(
    {
      key: { type: String, required: true },
      label: { type: String, required: true },
      severity: {
        type: String,
        enum: Object.values(
          INSIGHT_SEVERITY,
        ),
        required: true,
      },
      value: { type: Number, required: true },
    },
    nestedSchemaOptions,
  );

const financialInsightSchema =
  new Schema<IFinancialInsight>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
      },
      statementIds: [{
        type: Schema.Types.ObjectId,
        ref: "BankStatement",
      }],
      totalIncome: { type: Number, default: 0 },
      totalExpense: { type: Number, default: 0 },
      savings: { type: Number, default: 0 },
      avgMonthlySpend: { type: Number, default: 0 },
      averageBalance: { type: Number, default: 0 },
      savingsRate: { type: Number, default: 0 },
      financialHealthScore: { type: Number, default: 0 },
      riskScore: { type: Number, default: 0 },
      highestExpenseCategory: { type: String, default: "Others" },
      monthlySummaries: [monthlySummarySchema],
      categorySummaries: [categorySummarySchema],
      smartInsights: [smartInsightSchema],
      riskIndicators: [riskIndicatorSchema],
      recurringSubscriptions: [{ type: String }],
      recurringEmis: [{ type: String }],
      lowBalanceWarnings: { type: Number, default: 0 },
      unusualSpikes: { type: Number, default: 0 },
      generatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    },
  );

financialInsightSchema.index({
  riskScore: -1,
});

export const FinancialInsightModel =
  model<IFinancialInsight>(
    "FinancialInsight",
    financialInsightSchema,
  );

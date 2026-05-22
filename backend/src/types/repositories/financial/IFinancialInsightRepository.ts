import {
  IFinancialInsight,
} from "../../../models/FinancialInsight.model";

export interface IFinancialInsightRepository {
  findByUserId(
    userId: string,
  ): Promise<IFinancialInsight | null>;

  upsertByUserId(
    userId: string,
    data: Partial<IFinancialInsight>,
  ): Promise<IFinancialInsight>;
}

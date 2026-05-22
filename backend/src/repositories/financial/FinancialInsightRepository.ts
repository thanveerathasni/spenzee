import { injectable } from "inversify";

import {
  FinancialInsightModel,
  IFinancialInsight,
} from "../../models/FinancialInsight.model";
import {
  IFinancialInsightRepository,
} from "../../types/repositories/financial/IFinancialInsightRepository";

@injectable()
export class FinancialInsightRepository
  implements IFinancialInsightRepository {
  async findByUserId(
    userId: string,
  ): Promise<IFinancialInsight | null> {
    return FinancialInsightModel
      .findOne({ userId })
      .exec();
  }

  async upsertByUserId(
    userId: string,
    data: Partial<IFinancialInsight>,
  ): Promise<IFinancialInsight> {
    const insight =
      await FinancialInsightModel
        .findOneAndUpdate(
          { userId },
          {
            ...data,
            userId,
            generatedAt: new Date(),
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          },
        )
        .exec();

    return insight;
  }
}

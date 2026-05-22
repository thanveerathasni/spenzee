import { injectable } from "inversify";
import {
  QueryFilter,
  Types,
} from "mongoose";

import {
  BankTransactionModel,
  IBankTransaction,
} from "../../models/BankTransaction.model";
import {
  CreateBankTransactionData,
  IBankTransactionRepository,
  TransactionPage,
  TransactionQueryOptions,
} from "../../types/repositories/financial/IBankTransactionRepository";

@injectable()
export class BankTransactionRepository
  implements IBankTransactionRepository {
  async insertMany(
    data: CreateBankTransactionData[],
  ): Promise<IBankTransaction[]> {
    return Promise.all(
      data.map((item) =>
        BankTransactionModel.create({
          ...item,
          isRecurring:
            item.isRecurring ?? false,
          userId: new Types.ObjectId(
            item.userId,
          ),
          statementId:
            new Types.ObjectId(
              item.statementId,
            ),
        }),
      ),
    );
  }

  async deleteByStatementId(
    statementId: string,
  ): Promise<void> {
    await BankTransactionModel
      .deleteMany({ statementId })
      .exec();
  }

  async findByUserId(
    userId: string,
  ): Promise<IBankTransaction[]> {
    return BankTransactionModel
      .find({ userId })
      .sort({ transactionDate: 1 })
      .exec();
  }

  async findByStatementId(
    statementId: string,
  ): Promise<IBankTransaction[]> {
    return BankTransactionModel
      .find({ statementId })
      .sort({ transactionDate: 1 })
      .exec();
  }

  async paginateByUserId(
    userId: string,
    options: TransactionQueryOptions,
  ): Promise<TransactionPage> {
    const query:
      QueryFilter<IBankTransaction> = {
        userId,
      };

    if (options.search) {
      query.$or = [
        {
          description: {
            $regex: options.search,
            $options: "i",
          },
        },
        {
          merchant: {
            $regex: options.search,
            $options: "i",
          },
        },
      ];
    }

    if (options.category) {
      query.category =
        options.category;
    }

    if (options.type) {
      query.type = options.type;
    }

    if (
      options.startDate ||
      options.endDate
    ) {
      query.transactionDate = {};

      if (options.startDate) {
        query.transactionDate.$gte =
          options.startDate;
      }

      if (options.endDate) {
        query.transactionDate.$lte =
          options.endDate;
      }
    }

    if (
      options.minAmount !== undefined ||
      options.maxAmount !== undefined
    ) {
      query.amount = {};

      if (
        options.minAmount !== undefined
      ) {
        query.amount.$gte =
          options.minAmount;
      }

      if (
        options.maxAmount !== undefined
      ) {
        query.amount.$lte =
          options.maxAmount;
      }
    }

    const skip =
      (options.page - 1) *
      options.limit;

    const [data, total] =
      await Promise.all([
        BankTransactionModel
          .find(query)
          .sort({
            transactionDate: -1,
          })
          .skip(skip)
          .limit(options.limit)
          .exec(),
        BankTransactionModel
          .countDocuments(query)
          .exec(),
      ]);

    return {
      data,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(
        total / options.limit,
      ),
    };
  }

  async updateRecurringByIds(
    ids: string[],
  ): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    await BankTransactionModel
      .updateMany(
        {
          _id: {
            $in: ids,
          },
        },
        {
          isRecurring: true,
        },
      )
      .exec();
  }

  async count(
    filter: QueryFilter<IBankTransaction>,
  ): Promise<number> {
    return BankTransactionModel
      .countDocuments(filter)
      .exec();
  }
}

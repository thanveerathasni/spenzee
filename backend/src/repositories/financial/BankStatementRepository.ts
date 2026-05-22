import { injectable } from "inversify";
import {
  QueryFilter,
  Types,
  UpdateQuery,
} from "mongoose";

import {
  BankStatementModel,
  IBankStatement,
} from "../../models/BankStatement.model";
import {
  BANK_STATEMENT_STATUS,
  BankStatementStatus,
} from "../../shared/constants/bankStatement";
import {
  CreateBankStatementData,
  IBankStatementRepository,
} from "../../types/repositories/financial/IBankStatementRepository";

@injectable()
export class BankStatementRepository
  implements IBankStatementRepository {
  async create(
    data: CreateBankStatementData,
  ): Promise<IBankStatement> {
    return BankStatementModel.create({
      ...data,
      userId: new Types.ObjectId(
        data.userId,
      ),
      status:
        BANK_STATEMENT_STATUS.UPLOADED,
    });
  }

  async findById(
    id: string,
  ): Promise<IBankStatement | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return BankStatementModel
      .findById(id)
      .exec();
  }

  async findByUserId(
    userId: string,
  ): Promise<IBankStatement[]> {
    return BankStatementModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUserAndId(
    userId: string,
    id: string,
  ): Promise<IBankStatement | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return BankStatementModel
      .findOne({
        _id: id,
        userId,
      })
      .exec();
  }

  async existsByHash(
    userId: string,
    fileHash: string,
  ): Promise<boolean> {
    const exists =
      await BankStatementModel.exists({
        userId,
        fileHash,
      });

    return Boolean(exists);
  }

  async updateById(
    id: string,
    update: UpdateQuery<IBankStatement>,
  ): Promise<IBankStatement | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return BankStatementModel
      .findByIdAndUpdate(
        id,
        update,
        { new: true },
      )
      .exec();
  }

  async deleteByUserAndId(
    userId: string,
    id: string,
  ): Promise<IBankStatement | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return BankStatementModel
      .findOneAndDelete({
        _id: id,
        userId,
      })
      .exec();
  }

  async findAnalyzedByUserId(
    userId: string,
  ): Promise<IBankStatement[]> {
    return BankStatementModel
      .find({
        userId,
        status:
          BANK_STATEMENT_STATUS.ANALYZED,
        analyticsFrozen: false,
      })
      .sort({ periodStart: 1 })
      .exec();
  }

  async findAdminUserStatements(
    userId: string,
    status?: BankStatementStatus,
  ): Promise<IBankStatement[]> {
    const query: QueryFilter<IBankStatement> =
      { userId };

    if (status) {
      query.status = status;
    }

    return BankStatementModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async count(
    filter: QueryFilter<IBankStatement>,
  ): Promise<number> {
    return BankStatementModel.countDocuments(
      filter,
    );
  }
}

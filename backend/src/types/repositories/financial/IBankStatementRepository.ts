import {
  QueryFilter,
  UpdateQuery,
} from "mongoose";

import {
  IBankStatement,
} from "../../../models/BankStatement.model";
import {
  BankStatementStatus,
} from "../../../shared/constants/bankStatement";

export interface CreateBankStatementData {
  userId: string;
  originalFileUrl: string;
  originalFileName: string;
  fileHash: string;
  mimeType: string;
  fileSize: number;
}

export interface IBankStatementRepository {
  create(
    data: CreateBankStatementData,
  ): Promise<IBankStatement>;

  findById(
    id: string,
  ): Promise<IBankStatement | null>;

  findByUserId(
    userId: string,
  ): Promise<IBankStatement[]>;

  findByUserAndId(
    userId: string,
    id: string,
  ): Promise<IBankStatement | null>;

  existsByHash(
    userId: string,
    fileHash: string,
  ): Promise<boolean>;

  updateById(
    id: string,
    update: UpdateQuery<IBankStatement>,
  ): Promise<IBankStatement | null>;

  deleteByUserAndId(
    userId: string,
    id: string,
  ): Promise<IBankStatement | null>;

  findAnalyzedByUserId(
    userId: string,
  ): Promise<IBankStatement[]>;

  findAdminUserStatements(
    userId: string,
    status?: BankStatementStatus,
  ): Promise<IBankStatement[]>;

  count(
    filter: QueryFilter<IBankStatement>,
  ): Promise<number>;
}

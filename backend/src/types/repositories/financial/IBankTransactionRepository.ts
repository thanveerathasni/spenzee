import {
  QueryFilter,
} from "mongoose";

import {
  IBankTransaction,
} from "../../../models/BankTransaction.model";
import {
  BankTransactionType,
  FinancialCategory,
} from "../../../shared/constants/bankStatement";

export interface CreateBankTransactionData {
  userId: string;
  statementId: string;
  transactionDate: Date;
  description: string;
  normalizedDescription: string;
  merchant: string;
  referenceId?: string;
  amount: number;
  type: BankTransactionType;
  balance?: number;
  category: FinancialCategory;
  isRecurring?: boolean;
}

export interface TransactionQueryOptions {
  page: number;
  limit: number;
  search?: string;
  category?: FinancialCategory;
  type?: BankTransactionType;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionPage {
  data: IBankTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBankTransactionRepository {
  insertMany(
    data: CreateBankTransactionData[],
  ): Promise<IBankTransaction[]>;

  deleteByStatementId(
    statementId: string,
  ): Promise<void>;

  findByUserId(
    userId: string,
  ): Promise<IBankTransaction[]>;

  findByStatementId(
    statementId: string,
  ): Promise<IBankTransaction[]>;

  paginateByUserId(
    userId: string,
    options: TransactionQueryOptions,
  ): Promise<TransactionPage>;

  updateRecurringByIds(
    ids: string[],
  ): Promise<void>;

  count(
    filter: QueryFilter<IBankTransaction>,
  ): Promise<number>;
}

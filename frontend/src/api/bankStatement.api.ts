import { adminApi } from "./admin/adminAxios";
import { api } from "./axios";
import { API_ROUTES } from "../constants/apiRoutes";
import type {
  AdminFinancialAction,
  BankStatement,
  BankStatementStatus,
  FinancialInsight,
  TransactionFilters,
  TransactionList,
  UploadBankStatementsResult,
} from "../types/financial";

export const bankStatementApi = {
  upload: async (
    files: File[],
    onUploadProgress?: (
      progress: number,
    ) => void,
  ): Promise<UploadBankStatementsResult> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append(
        "statements",
        file,
      );
    });

    const res = await api.post(
      API_ROUTES.USER.BANK_STATEMENTS_UPLOAD,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (
            !event.total ||
            !onUploadProgress
          ) {
            return;
          }

          onUploadProgress(
            Math.round(
              (event.loaded * 100) /
                event.total,
            ),
          );
        },
      },
    );

    return res.data.data;
  },

  getStatements:
    async (): Promise<BankStatement[]> => {
      const res = await api.get(
        API_ROUTES.USER.BANK_STATEMENTS,
      );

      return res.data.data;
    },

  getAnalytics:
    async (): Promise<FinancialInsight | null> => {
      const res = await api.get(
        API_ROUTES.USER.BANK_STATEMENTS_ANALYTICS,
      );

      return res.data.data;
    },

  getTransactions:
    async (
      filters: TransactionFilters = {},
    ): Promise<TransactionList> => {
      const res = await api.get(
        API_ROUTES.USER.BANK_STATEMENTS_TRANSACTIONS,
        {
          params: filters,
        },
      );

      return res.data.data;
    },

  deleteStatement:
    async (
      statementId: string,
    ): Promise<void> => {
      await api.delete(
        `${API_ROUTES.USER.BANK_STATEMENTS}/${statementId}`,
      );
    },
};

export const adminFinancialApi = {
  getStatements:
    async (
      userId: string,
      status?: BankStatementStatus,
    ): Promise<BankStatement[]> => {
      const res = await adminApi.get(
        API_ROUTES.ADMIN.USER_STATEMENTS(
          userId,
        ),
        {
          params: {
            status,
          },
        },
      );

      return res.data.data;
    },

  getAnalytics:
    async (
      userId: string,
    ): Promise<FinancialInsight | null> => {
      const res = await adminApi.get(
        API_ROUTES.ADMIN.USER_ANALYTICS(
          userId,
        ),
      );

      return res.data.data;
    },

  updateStatementStatus:
    async (
      userId: string,
      statementId: string,
      payload: {
        action: AdminFinancialAction;
        note?: string;
        rejectionReason?: string;
      },
    ): Promise<BankStatement> => {
      const res = await adminApi.patch(
        API_ROUTES.ADMIN.USER_STATEMENT_STATUS(
          userId,
          statementId,
        ),
        payload,
      );

      return res.data.data;
    },
};

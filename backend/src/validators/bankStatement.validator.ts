import { z } from "zod";

import {
  ADMIN_FINANCIAL_ACTION,
  BANK_STATEMENT_STATUS,
  BANK_TRANSACTION_TYPE,
  FINANCIAL_CATEGORY,
} from "../shared/constants/bankStatement";

export const bankTransactionListSchema =
  z.object({
    query: z.object({
      page: z.coerce
        .number()
        .int()
        .min(1)
        .optional(),
      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .optional(),
      search: z.string().trim().optional(),
      category: z
        .enum(
          Object.values(
            FINANCIAL_CATEGORY,
          ) as [
            string,
            ...string[],
          ],
        )
        .optional(),
      type: z
        .enum(
          Object.values(
            BANK_TRANSACTION_TYPE,
          ) as [
            string,
            ...string[],
          ],
        )
        .optional(),
      startDate: z.coerce
        .date()
        .optional(),
      endDate: z.coerce
        .date()
        .optional(),
      minAmount: z.coerce
        .number()
        .min(0)
        .optional(),
      maxAmount: z.coerce
        .number()
        .min(0)
        .optional(),
    }),
  });

export const adminStatementListSchema =
  z.object({
    query: z.object({
      status: z
        .enum(
          Object.values(
            BANK_STATEMENT_STATUS,
          ) as [
            string,
            ...string[],
          ],
        )
        .optional(),
    }),
  });

export const adminStatementStatusSchema =
  z.object({
    body: z.object({
      action: z.enum(
        Object.values(
          ADMIN_FINANCIAL_ACTION,
        ) as [
          string,
          ...string[],
        ],
      ),
      status: z
        .enum(
          Object.values(
            BANK_STATEMENT_STATUS,
          ) as [
            string,
            ...string[],
          ],
        )
        .optional(),
      note: z.string().trim().max(500).optional(),
      rejectionReason: z
        .string()
        .trim()
        .max(500)
        .optional(),
    }),
  });

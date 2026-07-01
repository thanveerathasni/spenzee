import { z } from "zod";

import {
  objectIdSchema,
} from "./common.validator";

const commissionPercentageSchema =
  z.coerce
    .number()
    .min(0)
    .max(100);

export const providerCommerceIdParamSchema =
  z.object({
    params: z.object({
      id: objectIdSchema,
    }),
  });

export const providerCommerceApproveSchema =
  z.object({
    params: z.object({
      id: objectIdSchema,
    }),
    body: z.object({
      commissionPercentage:
        commissionPercentageSchema
          .optional(),
    }),
  });

export const providerCommerceRejectSchema =
  z.object({
    params: z.object({
      id: objectIdSchema,
    }),
    body: z.object({
      reason: z
        .string()
        .trim()
        .min(1)
        .max(500),
    }),
  });

export const providerCommissionUpdateSchema =
  z.object({
    params: z.object({
      id: objectIdSchema,
    }),
    body: z.object({
      commissionPercentage:
        commissionPercentageSchema,
    }),
  });

import { z } from "zod";
import { PRODUCT_STATUS } from "../constants/product";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const productSpecificationSchema = z.object({
  key: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

const imageSchema = z.string().trim().min(1);

const productBodySchema = z.object({
  productIdentificationCode: z.string().trim().min(1),
  name: z.string().trim().min(1),
  shortDescription: z.string().trim().optional(),
  fullDescription: z.string().trim().optional(),
  categoryId: z.string().trim().min(1),
  brand: z.string().trim().min(1),
  images: z.array(imageSchema).max(10).default([]),
  thumbnail: imageSchema,
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0),
  minimumStock: z.coerce.number().int().min(0).default(0),
  status: z
    .enum(Object.values(PRODUCT_STATUS) as [string, ...string[]])
    .default(PRODUCT_STATUS.DRAFT),
  tags: z.array(z.string().trim().min(1)).default([]),
  specifications: z.array(productSpecificationSchema).default([]),
  warranty: z.string().trim().optional(),
  returnPolicy: z.string().trim().optional(),
});

export const createProductSchema = z.object({
  body: productBodySchema,
});

export const updateProductSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: productBodySchema.partial(),
});

export const productIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const productStockSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    stock: z.coerce.number().int().min(0),
  }),
});

export const productListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().trim().optional(),
    status: z
      .enum(Object.values(PRODUCT_STATUS) as [string, ...string[]])
      .optional(),
    categoryId: z.string().trim().optional(),
    stock: z.enum(["LOW", "OUT", "IN"]).optional(),
  }),
});

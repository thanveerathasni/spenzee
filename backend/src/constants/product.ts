export const PRODUCT_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  ARCHIVED: "ARCHIVED",
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const PRODUCT_IMAGE_LIMITS = {
  MAX_GALLERY_IMAGES: 10,
  MAX_IMAGE_BYTES: 5 * 1024 * 1024,
  ALLOWED_PREFIXES: [
    "data:image/jpeg;base64,",
    "data:image/png;base64,",
    "data:image/webp;base64,",
  ],
} as const;

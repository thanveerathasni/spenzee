export type ProductStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "OUT_OF_STOCK"
  | "ARCHIVED";

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  providerId: string;
  productIdentificationCode: string;
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  categoryId: string;
  brand: string;
  images: string[];
  thumbnail: string;
  price: number;
  originalPrice?: number;
  stock: number;
  minimumStock: number;
  status: ProductStatus;
  tags: string[];
  specifications: ProductSpecification[];
  warranty?: string;
  returnPolicy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductPayload {
  productIdentificationCode: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  categoryId: string;
  brand: string;
  images: string[];
  thumbnail: string;
  price: number;
  originalPrice?: number;
  stock: number;
  minimumStock: number;
  status: ProductStatus;
  tags: string[];
  specifications: ProductSpecification[];
  warranty?: string;
  returnPolicy?: string;
}

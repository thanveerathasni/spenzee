import { ProductStatus } from "../constants/product";
import { ProductSpecification } from "../models/Product.model";

export interface ProductDTO {
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
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductListDTO {
  products: ProductDTO[];
  total: number;
  page: number;
  totalPages: number;
}

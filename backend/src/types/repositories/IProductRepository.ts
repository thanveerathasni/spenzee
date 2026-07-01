import { Types } from "mongoose";
import { ProductStatus } from "../../constants/product";
import { IProduct } from "../../models/Product.model";

export interface ProductListQuery {
  providerId: string;
  page: number;
  limit: number;
  search: string;
  status: ProductStatus | "";
  categoryId: string;
  stock: "LOW" | "OUT" | "IN" | "";
}

export interface ProductListResult {
  products: IProduct[];
  total: number;
}

export interface IProductRepository {
  create(data: Partial<IProduct>): Promise<IProduct>;
  findById(productId: string): Promise<IProduct | null>;
  findByProvider(query: ProductListQuery): Promise<ProductListResult>;
  findByProviderAndPic(
    providerId: string,
    productIdentificationCode: string
  ): Promise<IProduct | null>;
  findPublishedProducts(
    page: number,
    limit: number,
    search: string
  ): Promise<ProductListResult>;
  updateById(
    productId: string,
    data: Partial<IProduct>
  ): Promise<IProduct | null>;
  archiveProduct(
    productId: string,
    updatedBy: Types.ObjectId
  ): Promise<IProduct | null>;
  restoreProduct(
    productId: string,
    updatedBy: Types.ObjectId
  ): Promise<IProduct | null>;
  updateStock(
    productId: string,
    stock: number,
    updatedBy: Types.ObjectId
  ): Promise<IProduct | null>;
  deleteById(productId: string): Promise<boolean>;
}

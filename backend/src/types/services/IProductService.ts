import { ProductStatus } from "../../constants/product";
import { ProductDTO, ProductListDTO } from "../../dto/product.dto";
import { ProductSpecification } from "../../models/Product.model";

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

export interface ProductListFilters {
  page: number;
  limit: number;
  search: string;
  status: ProductStatus | "";
  categoryId: string;
  stock: "LOW" | "OUT" | "IN" | "";
}

export interface IProductService {
  createProduct(providerId: string, payload: ProductPayload): Promise<ProductDTO>;
  getProviderProducts(
    providerId: string,
    filters: ProductListFilters
  ): Promise<ProductListDTO>;
  getProviderProduct(providerId: string, productId: string): Promise<ProductDTO>;
  updateProduct(
    providerId: string,
    productId: string,
    payload: Partial<ProductPayload>
  ): Promise<ProductDTO>;
  deleteProduct(providerId: string, productId: string): Promise<void>;
  archiveProduct(providerId: string, productId: string): Promise<ProductDTO>;
  restoreProduct(providerId: string, productId: string): Promise<ProductDTO>;
  updateStock(
    providerId: string,
    productId: string,
    stock: number
  ): Promise<ProductDTO>;
}

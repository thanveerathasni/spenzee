import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../di/types";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { PRODUCT_STATUS } from "../constants/product";
import { ProductDTO, ProductListDTO } from "../dto/product.dto";
import { ProductMapper } from "../mappers/ProductMapper";
import { IProduct } from "../models/Product.model";
import { IProductRepository } from "../types/repositories/IProductRepository";
import {
  IProductService,
  ProductListFilters,
  ProductPayload,
} from "../types/services/IProductService";
import { BadRequestError, ForbiddenError } from "../utils/errors";
import { logger } from "../utils/logger";
import { ProductImageService } from "./ProductImageService";

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject(TYPES.ProductRepository)
    private readonly productRepository: IProductRepository,

    @inject(TYPES.ProductImageService)
    private readonly productImageService: ProductImageService
  ) {}

  async createProduct(
    providerId: string,
    payload: ProductPayload
  ): Promise<ProductDTO> {
    this.validatePricesAndStock(payload);
    await this.assertUniquePic(providerId, payload.productIdentificationCode);

    const providerObjectId = new Types.ObjectId(providerId);
    const product = await this.productRepository.create({
      ...payload,
      productIdentificationCode: this.normalizePic(
        payload.productIdentificationCode
      ),
      slug: this.createSlug(payload.name),
      thumbnail: this.productImageService.validateThumbnail(payload.thumbnail),
      images: this.productImageService.validateGallery(payload.images),
      status: this.resolveStatus(payload.status, payload.stock),
      providerId: providerObjectId,
      createdBy: providerObjectId,
      updatedBy: providerObjectId,
    });

    logger.info("Product Created", {
      providerId,
      productId: product._id.toString(),
    });

    return ProductMapper.toDTO(product);
  }

  async getProviderProducts(
    providerId: string,
    filters: ProductListFilters
  ): Promise<ProductListDTO> {
    const result = await this.productRepository.findByProvider({
      providerId,
      ...filters,
    });

    return {
      products: result.products.map(ProductMapper.toDTO),
      total: result.total,
      page: filters.page,
      totalPages: Math.ceil(result.total / filters.limit),
    };
  }

  async getProviderProduct(
    providerId: string,
    productId: string
  ): Promise<ProductDTO> {
    const product = await this.getOwnedProduct(providerId, productId);
    return ProductMapper.toDTO(product);
  }

  async updateProduct(
    providerId: string,
    productId: string,
    payload: Partial<ProductPayload>
  ): Promise<ProductDTO> {
    const product = await this.getOwnedProduct(providerId, productId);

    if (payload.productIdentificationCode) {
      await this.assertUniquePic(
        providerId,
        payload.productIdentificationCode,
        product._id.toString()
      );
    }

    this.validatePricesAndStock({
      ...ProductMapper.toDTO(product),
      ...payload,
    });

    const updated = await this.productRepository.updateById(productId, {
      ...payload,
      productIdentificationCode: payload.productIdentificationCode
        ? this.normalizePic(payload.productIdentificationCode)
        : undefined,
      slug: payload.name ? this.createSlug(payload.name) : undefined,
      thumbnail: payload.thumbnail
        ? this.productImageService.validateThumbnail(payload.thumbnail)
        : undefined,
      images: payload.images
        ? this.productImageService.validateGallery(payload.images)
        : undefined,
      status:
        payload.status || payload.stock !== undefined
          ? this.resolveStatus(payload.status ?? product.status, payload.stock ?? product.stock)
          : undefined,
      updatedBy: new Types.ObjectId(providerId),
    });

    if (!updated) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.NOT_FOUND);
    }

    logger.info("Product Updated", {
      providerId,
      productId,
    });

    return ProductMapper.toDTO(updated);
  }

  async deleteProduct(providerId: string, productId: string): Promise<void> {
    await this.getOwnedProduct(providerId, productId);
    const deleted = await this.productRepository.deleteById(productId);

    if (!deleted) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.NOT_FOUND);
    }

    logger.info("Product Deleted", {
      providerId,
      productId,
    });
  }

  async archiveProduct(
    providerId: string,
    productId: string
  ): Promise<ProductDTO> {
    await this.getOwnedProduct(providerId, productId);
    const product = await this.productRepository.archiveProduct(
      productId,
      new Types.ObjectId(providerId)
    );

    if (!product) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.NOT_FOUND);
    }

    logger.info("Product Archived", {
      providerId,
      productId,
    });

    return ProductMapper.toDTO(product);
  }

  async restoreProduct(
    providerId: string,
    productId: string
  ): Promise<ProductDTO> {
    await this.getOwnedProduct(providerId, productId);
    const product = await this.productRepository.restoreProduct(
      productId,
      new Types.ObjectId(providerId)
    );

    if (!product) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.NOT_FOUND);
    }

    logger.info("Product Restored", {
      providerId,
      productId,
    });

    return ProductMapper.toDTO(product);
  }

  async updateStock(
    providerId: string,
    productId: string,
    stock: number
  ): Promise<ProductDTO> {
    if (stock < 0) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.INVALID_STOCK);
    }

    await this.getOwnedProduct(providerId, productId);
    const product = await this.productRepository.updateStock(
      productId,
      stock,
      new Types.ObjectId(providerId)
    );

    if (!product) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.NOT_FOUND);
    }

    logger.info("Stock Updated", {
      providerId,
      productId,
      stock,
    });

    return ProductMapper.toDTO(product);
  }

  private async getOwnedProduct(
    providerId: string,
    productId: string
  ): Promise<IProduct> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.NOT_FOUND);
    }

    if (product.providerId.toString() !== providerId) {
      throw new ForbiddenError(ERROR_MESSAGES.PRODUCT.FORBIDDEN);
    }

    return product;
  }

  private async assertUniquePic(
    providerId: string,
    productIdentificationCode: string,
    currentProductId?: string
  ): Promise<void> {
    const existing = await this.productRepository.findByProviderAndPic(
      providerId,
      this.normalizePic(productIdentificationCode)
    );

    if (existing && existing._id.toString() !== currentProductId) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.DUPLICATE_PIC);
    }
  }

  private validatePricesAndStock(
    payload: Pick<ProductPayload, "name" | "price" | "stock" | "originalPrice" | "thumbnail">
  ): void {
    if (!payload.name.trim()) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.NAME_REQUIRED);
    }

    if (payload.price < 0 || (payload.originalPrice ?? 0) < 0) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.INVALID_PRICE);
    }

    if (payload.stock < 0) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.INVALID_STOCK);
    }

    if (!payload.thumbnail.trim()) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT.THUMBNAIL_REQUIRED);
    }
  }

  private resolveStatus(status: ProductPayload["status"], stock: number) {
    if (status === PRODUCT_STATUS.ARCHIVED || status === PRODUCT_STATUS.DRAFT) {
      return status;
    }

    if (stock === 0) {
      return PRODUCT_STATUS.OUT_OF_STOCK;
    }

    return status;
  }

  private normalizePic(productIdentificationCode: string): string {
    return productIdentificationCode.trim().replace(/\s+/g, "_").toUpperCase();
  }

  private createSlug(name: string): string {
    const suffix = Date.now().toString(36);
    const base = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return `${base}-${suffix}`;
  }
}

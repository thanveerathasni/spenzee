import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { SUCCESS_MESSAGES } from "../constants/successMessages";
import { IProductService } from "../types/services/IProductService";
import { AuthRequest } from "../types/AuthRequest";
import { UnauthorizedError } from "../utils/errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { sendResponse } from "../utils/sendResponse";
import { HTTP_STATUS } from "../constants/httpStatus";
import { ProductStatus } from "../constants/product";

@injectable()
export class ProductController {
  constructor(
    @inject(TYPES.ProductService)
    private readonly productService: IProductService
  ) {}

  async create(req: AuthRequest, res: Response): Promise<Response> {
    const data = await this.productService.createProduct(
      this.getProviderId(req),
      req.body
    );

    return sendResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: SUCCESS_MESSAGES.PRODUCT.CREATED,
      data,
    });
  }

  async list(req: AuthRequest, res: Response): Promise<Response> {
    const data = await this.productService.getProviderProducts(
      this.getProviderId(req),
      {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: String(req.query.search ?? ""),
        status: this.toProductStatus(req.query.status),
        categoryId: String(req.query.categoryId ?? ""),
        stock: this.toStockFilter(req.query.stock),
      }
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PRODUCT.LIST_FETCHED,
      data,
    });
  }

  async getById(req: AuthRequest, res: Response): Promise<Response> {
    const data = await this.productService.getProviderProduct(
      this.getProviderId(req),
      req.params.id
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PRODUCT.FETCHED,
      data,
    });
  }

  async update(req: AuthRequest, res: Response): Promise<Response> {
    const data = await this.productService.updateProduct(
      this.getProviderId(req),
      req.params.id,
      req.body
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PRODUCT.UPDATED,
      data,
    });
  }

  async delete(req: AuthRequest, res: Response): Promise<Response> {
    await this.productService.deleteProduct(
      this.getProviderId(req),
      req.params.id
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PRODUCT.DELETED,
    });
  }

  async archive(req: AuthRequest, res: Response): Promise<Response> {
    const data = await this.productService.archiveProduct(
      this.getProviderId(req),
      req.params.id
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PRODUCT.ARCHIVED,
      data,
    });
  }

  async restore(req: AuthRequest, res: Response): Promise<Response> {
    const data = await this.productService.restoreProduct(
      this.getProviderId(req),
      req.params.id
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PRODUCT.RESTORED,
      data,
    });
  }

  async updateStock(req: AuthRequest, res: Response): Promise<Response> {
    const data = await this.productService.updateStock(
      this.getProviderId(req),
      req.params.id,
      req.body.stock
    );

    return sendResponse({
      res,
      message: SUCCESS_MESSAGES.PRODUCT.STOCK_UPDATED,
      data,
    });
  }

  private getProviderId(req: AuthRequest): string {
    const providerId = req.user?.id;

    if (!providerId) {
      throw new UnauthorizedError(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    }

    return providerId;
  }

  private toProductStatus(value: Request["query"][string]): ProductStatus | "" {
    return typeof value === "string" ? (value as ProductStatus) : "";
  }

  private toStockFilter(value: Request["query"][string]): "LOW" | "OUT" | "IN" | "" {
    if (value === "LOW" || value === "OUT" || value === "IN") {
      return value;
    }

    return "";
  }
}

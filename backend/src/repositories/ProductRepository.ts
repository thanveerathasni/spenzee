import { injectable } from "inversify";
import { Types } from "mongoose";
import { PRODUCT_STATUS } from "../constants/product";
import { IProduct, ProductModel } from "../models/Product.model";
import {
  IProductRepository,
  ProductListQuery,
  ProductListResult,
} from "../types/repositories/IProductRepository";

type NumberCondition = {
  $gt?: number;
};

type TextSearchCondition = {
  $search: string;
};

type StatusCondition = {
  $in: string[];
};

type ExpressionCondition = {
  $lte: [string, string];
};

type ProductMongoFilter = {
  providerId?: string;
  status?: string | StatusCondition;
  categoryId?: string;
  stock?: number | NumberCondition;
  $text?: TextSearchCondition;
  $expr?: ExpressionCondition;
};

@injectable()
export class ProductRepository implements IProductRepository {
  async create(data: Partial<IProduct>): Promise<IProduct> {
    return ProductModel.create(data);
  }

  async findById(productId: string): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(productId)) {
      return null;
    }

    return ProductModel.findById(productId).exec();
  }

  async findByProvider(query: ProductListQuery): Promise<ProductListResult> {
    const filter = this.buildProviderFilter(query);
    const skip = (query.page - 1) * query.limit;

    const [products, total] = await Promise.all([
      ProductModel.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .exec(),
      ProductModel.countDocuments(filter).exec(),
    ]);

    return { products, total };
  }

  async findByProviderAndPic(
    providerId: string,
    productIdentificationCode: string
  ): Promise<IProduct | null> {
    return ProductModel.findOne({
      providerId,
      productIdentificationCode,
    }).exec();
  }

  async findPublishedProducts(
    page: number,
    limit: number,
    search: string
  ): Promise<ProductListResult> {
    const filter: ProductMongoFilter = {
      status: {
        $in: [
          PRODUCT_STATUS.PUBLISHED,
          PRODUCT_STATUS.OUT_OF_STOCK,
        ],
      },
    };

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      ProductModel.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      ProductModel.countDocuments(filter).exec(),
    ]);

    return { products, total };
  }

  async updateById(
    productId: string,
    data: Partial<IProduct>
  ): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(productId)) {
      return null;
    }

    return ProductModel.findByIdAndUpdate(productId, data, {
      new: true,
    }).exec();
  }

  async archiveProduct(
    productId: string,
    updatedBy: Types.ObjectId
  ): Promise<IProduct | null> {
    return this.updateById(productId, {
      status: PRODUCT_STATUS.ARCHIVED,
      updatedBy,
    });
  }

  async restoreProduct(
    productId: string,
    updatedBy: Types.ObjectId
  ): Promise<IProduct | null> {
    return this.updateById(productId, {
      status: PRODUCT_STATUS.DRAFT,
      updatedBy,
    });
  }

  async updateStock(
    productId: string,
    stock: number,
    updatedBy: Types.ObjectId
  ): Promise<IProduct | null> {
    return this.updateById(productId, {
      stock,
      updatedBy,
      status: stock === 0 ? PRODUCT_STATUS.OUT_OF_STOCK : undefined,
    });
  }

  async deleteById(productId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(productId)) {
      return false;
    }

    const result = await ProductModel.deleteOne({
      _id: productId,
    }).exec();

    return result.deletedCount === 1;
  }

  private buildProviderFilter(
    query: ProductListQuery
  ): ProductMongoFilter {
    const filter: ProductMongoFilter = {
      providerId: query.providerId,
    };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.categoryId) {
      filter.categoryId = query.categoryId;
    }

    if (query.search) {
      filter.$text = {
        $search: query.search,
      };
    }

    if (query.stock === "OUT") {
      filter.stock = 0;
    }

    if (query.stock === "LOW") {
      filter.$expr = {
        $lte: ["$stock", "$minimumStock"],
      };
    }

    if (query.stock === "IN") {
      filter.stock = {
        $gt: 0,
      };
    }

    return filter;
  }
}
